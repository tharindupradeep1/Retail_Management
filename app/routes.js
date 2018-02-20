// app/routes.js
module.exports = function(app, passport) {
	var mysql = require('mysql');
	var dbconfig = require('../config/database');
	var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);
const ejs = require('ejs');
var socket = require('socket.io');
//var server = 'http://localhost:8080';
//var io = socket(server);
const random = require('node-random-number');
var nodemailer = require("nodemailer");
var dateTime = require('node-datetime');
var bcrypt = require('bcrypt-nodejs');
var cc = require('coupon-code');
var check = require('check-types');
const request = require('request');
var https = require('https');
var io = socket(server);

io.on('connection', function(socket) {
		console.log('made socket connection', socket.id);
		socket.on('sentShipping', function(data){
			io.sockets.emit('sentShipping', data);
	});

	socket.on('shipped', function(data){
		io.sockets.emit('shipped', data);
});
		});


		var smtpTransport = nodemailer.createTransport({
		    service: 'gmail',
		    host: 'smtp.gmail.com',
		    port: 587,
		    auth: {
		        user: 'retailcodebreakers@gmail.com',
		        pass: 'codebreakers2018'
		    },
		    tls: {rejectUnauthorized: false},
		    debug:true
		});



//successfully purchased notification page
app.get('/purchased', function(req, res) {
	res.render('purchased.ejs');
});

//get the index page
app.get('/', function(req, res) {
			sess=req.session;

connection.query('SELECT * FROM category',function(err, rows){

		if(sess.username)
		{
			connection.query('SELECT * FROM customer where CID = ?',[sess.CID],function(err, result){
				if(result[0].confirmStatus=="No"){
			res.render('profile.ejs',{
				result : rows,
				message : "Please Confirm Your account from the link you received to your email address.."
			});
			}
			else{
		res.render('profile.ejs',{
			result : rows,
			message : 0,
			categ : 0
		});
	}
			});
		}
		else{
			res.render('index.ejs',{
			result : rows
			});
		}
		});
	});

//get the profile page
app.get('/profile', isLoggedIn, function(req, res) {
			sess=req.session;
				if(sess.username){
		connection.query('SELECT * FROM category',function(err, rows){
			connection.query('SELECT * FROM customer where CID = ?',[sess.CID],function(err, result){
			if(result[0].confirmStatus=="No"){
		res.render('profile.ejs',{
			result : rows,
			message : "Please Confirm Your account from the link you received to your email address.."
		});
		}
		else{
	res.render('profile.ejs',{
		result : rows,
		message : 0
	});
	}
		});
		});
}
				else{
				  res.redirect('/');
				}
	});


	app.get('/confirmEmail', function(req, res, next) {
		sess=req.session;
		if(sess.username){
		var updatestock = 'UPDATE customer SET confirmStatus =? WHERE Username = ?';
			connection.query(updatestock,["Yes",sess.username],function(err, rows) {
				 if(!err){
						res.redirect('/profile');
				}
		else
			console.log("Error");
		});
}
else{
	 res.redirect('/login');
}
	});

	app.get('/resetPassword', function(req, res, next) {
		res.render('resetPassword.ejs',{
			message: 0
		});
	});

	app.post('/resetPassword', function(req, res) {
		connection.query("SELECT * FROM customer WHERE Email = ?",[req.body.email], function(err, rows) {
			if(rows.length){
				var bodyE = 'Dear Customer,'+'\n'+ 'Please Click on the below link to reset your login password of the website.'+'\n'+ '\n'+"https://retailcodebreakers.herokuapp.com/resettingPass" +'\n'+ 'Your Username is : '+rows[0].Username +'\n'+'Thank you' +'\n'+ 'Retail Management Store Team';

					var mailOptions={
						to : req.body.email,
						subject : "Password Reset Link",
						text : bodyE
					}
					smtpTransport.sendMail(mailOptions, function(error, response){
						 if(error){
									console.log(error);
					 }else{
									console.log("Message sent: " + response.message);
							 }
				});
				res.render('passEmail.ejs');
			}
			else{
				res.render('resetPassword.ejs',{
						message : "Please enter a valid email address.."
				});
			}
		 });
});
		app.get('/resettingPass', function(req, res, next) {
			res.render('resettingPass.ejs', {
				message: 0
			});
		});

		app.post('/resettingPass', function(req, res) {
			connection.query("SELECT * FROM customer WHERE Username = ?",[req.body.username], function(err, rows) {
					if (rows.length) {
							console.log("Password confirmation OK");
							connection.query("UPDATE customer SET Password=? WHERE Username = ? ",[bcrypt.hashSync(req.body.NPass, null, null),req.body.username],function(err, rows){
								res.render('resetedPass.ejs');
							});
						}
						else{
							res.render('resettingPass.ejs', {
								message: "Username entered is Invalid.!!"
							});
						}
		});
	});
//get the dashboard(homepage of Admin)
app.get('/dashboard', function(req, res) {
				sess=req.session;
			if(sess.Adminusername && sess.role=="Admin")
			{

				connection.query('SELECT * FROM product JOIN proSizes ON	product.PID=proSizes.PID' ,function(err, rows){
					if(!err){
				res.render('dashboard.ejs',{
					result : rows
					});
				}
				});
			}
				else{
			res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
			}
		});

		app.get('/chart', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
					{
						res.render('chart2.ejs');
					}
						else{
					res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
					}
				});

		app.post('/chart', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
					{
						var TotProd = 0;
						var data = [];
						var dataTrouser = [];
						var dataFrock = [];
						var dataBlouse = [];
						var dataSkirt = [];
						var dataShorts = [];
						var dataSaree = [];
						var i=0;
								connection.query('SELECT * FROM ordert JOIN orderdetails ON	ordert.OrderID=orderdetails.OrderID JOIN product ON orderdetails.PID=product.PID' ,function(err, result){
									if(!err){
										for(i=1;i<32;i++){
											BillDate = req.body.month +"-"+i;
											console.log(BillDate);
											TotProd=0;
											TotProdTrouser=0;
											TotProdFrock=0;
											TotProdBlouse=0;
											TotProdSkirt=0;
											TotProdShorts=0;
											TotProdSaree=0;
										  result.forEach( function( result ) {
												if(result.category=="Tshirt" && result.BillingDate==BillDate){
													TotProd = TotProd + result.Quantity;
												}
											data[i-1] = TotProd;

											if(result.category=="Trouser" && result.BillingDate==BillDate){
												TotProdTrouser = TotProdTrouser + result.Quantity;
											}
											dataTrouser[i-1] = TotProdTrouser;
											if(result.category=="Frock" && result.BillingDate==BillDate){
												TotProdFrock = TotProdFrock + result.Quantity;
											}
										dataFrock[i-1] = TotProdFrock;

										if(result.category=="Blouse" && result.BillingDate==BillDate){
											TotProdBlouse = TotProdBlouse + result.Quantity;
										}
										dataBlouse[i-1] = TotProdBlouse;
										if(result.category=="Skirt" && result.BillingDate==BillDate){
											TotProdSkirt = TotProdSkirt + result.Quantity;
										}
									dataSkirt[i-1] = TotProdSkirt;

									if(result.category=="Shorts" && result.BillingDate==BillDate){
										TotProdShorts = TotProdShorts + result.Quantity;
									}
									dataShorts[i-1] = TotProdShorts;
										if(result.category=="Saree" && result.BillingDate==BillDate){
										TotProdSaree = TotProdSaree + result.Quantity;
										}
										dataSaree[i-1] = TotProdSaree;
									});

										}
										sess.value = data;
										sess.valueTrouser = dataTrouser;
										sess.valueFrock = dataFrock;
										sess.valueBlouse = dataBlouse;
										sess.valueSkirt = dataSkirt;
										sess.valueShorts = dataShorts;
										sess.valueSaree = dataSaree;

						res.render('chart.ejs',{
							date : req.body.month
						});
							}
						});
					}
						else{
					res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
					}
				});


		//get the homepage of the shipping Admin
		app.get('/shippingDashboard', function(req, res) {
				sess=req.session;
			if(sess.Adminusername && sess.role=="Shipping Admin")
			{
				connection.query('SELECT * FROM orderdetails JOIN ordershipping ON	orderdetails.OrderID=ordershipping.OrderID JOIN product ON orderdetails.PID=product.PID',function(err, rows){
					if(!err){
				res.render('shippingDashboard.ejs',{
					result : rows
				});
				}
				});
			}
			else{
				res.render('shipAdminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
			}
		});

		app.get('/shippingHistory', function(req, res) {
				sess=req.session;
			if(sess.Adminusername && sess.role=="Shipping Admin")
			{
				connection.query('SELECT * FROM orderdetails JOIN ordershipping ON	orderdetails.OrderID=ordershipping.OrderID JOIN product ON orderdetails.PID=product.PID',function(err, rows){
					if(!err){
				res.render('shippingHistory.ejs',{
					result : rows
				});
				}
				});
			}
			else{
				res.render('shipAdminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
			}
		});

		app.get('/customerDetails',function(req, res) {
				sess=req.session;
			if(sess.Adminusername && sess.role=="Shipping Admin")
			{
				connection.query('SELECT * FROM customer where CID = ?',[req.query.cid],function(err, rows){
					if(!err){
				res.render('customerDetails.ejs',{
					result : rows
				});
				}
				});
			}
			else{
				res.render('shipAdminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
			}
		});

//post requests in shipping dashboard page
		app.post('/shippingDashboard', function(req, res) {
			sess=req.session;
		if(sess.Adminusername && sess.role=="Shipping Admin")
		{
				var dt = dateTime.create();
				var format = dt.format('Y-m-d-H:M:S');
			connection.query('UPDATE ordershipping SET shipStatus = ?, shippingDate = ? where OrderID = ?',["Shipped",format,req.query.OID],function(err, rows){
				connection.query('SELECT * FROM orderdetails JOIN ordershipping ON	orderdetails.OrderID=ordershipping.OrderID JOIN product ON orderdetails.PID=product.PID',function(err, rows){
					if(!err){
				res.render('shippingDashboard.ejs',{
					result : rows
				});
			}
		});
		});
	}
		else{
	res.render('shipAdminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
	}
		});


	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the customer login form
	app.post('/login', passport.authenticate('local-login', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/login', // redirect back to the login page if there is an error
          failureFlash : true // allow flash messages
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 5; //session expires in 5 minutes
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

		app.get('/editprofile', function(req, res) {
		// render the page and pass in any flash data if it exists
		sess=req.session;
		if(sess.username){
		connection.query('SELECT * FROM customer where CID = ? ',[sess.CID] ,function(err, rows){
		res.render('editprofile.ejs', {
			sess : req.session,
			result : rows,
			message: 0,
			message1: 0
		});
		});
	}

	else{
		res.redirect('/login');
	}
	});


			app.post('/editprofile', function(req, res) {
			// render the page and pass in any flash data if it exists
			sess=req.session;
			if(sess.username){
			  connection.query("SELECT * FROM customer WHERE Username = ?",[req.body.username], function(err, rows) {
					 connection.query("SELECT * FROM customer WHERE Email = ?",[req.body.email], function(err, row) {
					  if (rows.length) {
							res.render('editprofile.ejs', {
								message1: "Username exists.Please enter another username.",
								message: 0,
								result : rows
							});
						}
						else if (row.length) {
						 res.render('editprofile.ejs', {
							 message1: "Email exists.Please enter another Email.",
							 message: 0,
							 result : row
						 });
					 }
						else{
								connection.query("SELECT * FROM customer WHERE CID = ?",[sess.CID], function(err, result) {
							connection.query("UPDATE customer SET Username =?, FName=?, LName=?, Email=? , Address=? WHERE CID = ? ",[req.body.username,req.body.fname,req.body.lname,req.body.email,req.body.address,sess.CID],function(err, row){
								res.render('editprofile.ejs', {
									message1: "Congratulations ! Details were Updated Successfully.",
									message: 0,
									result : result
								});
							});
								});
						}
});
			});
		}
		else{
			res.redirect('/login');
		}
		});


		app.post('/editpassword', function(req, res) {
		// render the page and pass in any flash data if it exists
		sess=req.session;
		if(sess.username){
			connection.query("SELECT * FROM customer WHERE Username = ?",[req.body.username], function(err, rows) {
					if (rows.length) {
						res.render('editprofile.ejs', {
							message: "Username exists.Please enter another username.",
							message1: 0,
							result : rows
						});
					}
					else{
								connection.query("SELECT * FROM customer WHERE CID = ?",[sess.CID], function(err, row) {
						if (bcrypt.compareSync(req.body.Curpassword, row[0].Password)){
							console.log("Password confirmation OK");
							connection.query("UPDATE customer SET Username =?, Password=? WHERE CID = ? ",[req.body.username,bcrypt.hashSync(req.body.password, null, null),sess.CID],function(err, rows){
								res.render('editprofile.ejs', {
									message: "Congratulations ! Details were Updated Successfully.",
									message1: 0,
									result : row
								});
							});
						}

						else{
							res.render('editprofile.ejs', {
								message: "Please enter the correct password for Current Password",
								message1: 0,
								result : row
							});
						}
					});

					}
		});
	}
	else{
		res.redirect('/login');
	}
	});


	app.get('/editprofileAdmin', function(req, res) {
	// render the page and pass in any flash data if it exists
	sess=req.session;
	if(sess.Adminusername){
	connection.query('SELECT * FROM administrator where AdminID = ? ',[sess.AdminID] ,function(err, rows){
	res.render('editprofileAdmin.ejs', {
		sess : req.session,
		result : rows,
		message: 0,
		message1: 0
	});
	});
	}

	else{
	res.redirect('/adminLogin');
	}
	});

	app.post('/editprofileAdmin', function(req, res) {
	// render the page and pass in any flash data if it exists
	sess=req.session;
	if(sess.Adminusername){
		connection.query("SELECT * FROM administrator WHERE Username = ?",[req.body.username], function(err, rows) {
				if (rows.length) {
					res.render('editprofileAdmin.ejs', {
						message1: "Username exists.Please enter another username.",
						message: 0,
						result : rows
					});
				}
				else{
						connection.query("SELECT * FROM administrator WHERE AdminID = ?",[sess.AdminID], function(err, result) {
					connection.query("UPDATE administrator SET Username =?, FName=?, LName=?, Email=? , Address=? WHERE AdminID = ? ",[req.body.username,req.body.fname,req.body.lname,req.body.email,req.body.address,sess.AdminID],function(err, row){
						res.render('editprofileAdmin.ejs', {
							message1: "Congratulations ! Details were Updated Successfully.",
							message: 0,
							result : result
						});
					});
						});
				}

	});
}
else{
	res.redirect('/adminLogin');
}
});

	app.get('/editprofileShippingAdmin', function(req, res) {
	// render the page and pass in any flash data if it exists
	sess=req.session;
	if(sess.Adminusername){
	connection.query('SELECT * FROM administrator where AdminID = ? ',[sess.AdminID] ,function(err, rows){
	res.render('editprofileShippingAdmin.ejs', {
		sess : req.session,
		result : rows,
		message: 0,
		message1: 0
	});
	});
	}

	else{
	res.redirect('/adminLogin');
	}
	});

		app.post('/editprofileShippingAdmin', function(req, res) {
		// render the page and pass in any flash data if it exists
		sess=req.session;
		if(sess.Adminusername){
			connection.query("SELECT * FROM administrator WHERE Username = ?",[req.body.username], function(err, rows) {
					if (rows.length) {
						res.render('editprofileShippingAdmin.ejs', {
							message1: "Username exists.Please enter another username.",
							message: 0,
							result : rows
						});
					}
					else{
							connection.query("SELECT * FROM administrator WHERE AdminID = ?",[sess.AdminID], function(err, result) {
						connection.query("UPDATE administrator SET Username =?, FName=?, LName=?, Email=? , Address=? WHERE AdminID = ? ",[req.body.username,req.body.fname,req.body.lname,req.body.email,req.body.address,sess.AdminID],function(err, row){
							res.render('editprofileShippingAdmin.ejs', {
								message1: "Congratulations ! Details were Updated Successfully.",
								message: 0,
								result : result
							});
						});
							});
					}

		});
	}
	else{
		res.redirect('/adminLogin');
	}
	});


	app.post('/editpasswordAdmin', function(req, res) {
	// render the page and pass in any flash data if it exists
	sess=req.session;
	if(sess.Adminusername){
		connection.query("SELECT * FROM administrator WHERE Username = ?",[req.body.username], function(err, rows) {
				if (rows.length) {
					res.render('editprofileAdmin.ejs', {
						message: "Username exists.Please enter another username.",
						message1: 0,
						result : rows
					});
				}
				else{
							connection.query("SELECT * FROM administrator WHERE AdminID = ?",[sess.AdminID], function(err, row) {
					if (bcrypt.compareSync(req.body.Curpassword, row[0].Password)){
						console.log("Password confirmation OK");
						connection.query("UPDATE administrator SET Password=? WHERE AdminID = ? ",[bcrypt.hashSync(req.body.password, null, null),sess.AdminID],function(err, rows){
							res.render('editprofileAdmin.ejs', {
								message: "Congratulations ! Details were Updated Successfully.",
								message1: 0,
								result : row
							});
						});
					}

					else{
						res.render('editprofileAdmin.ejs', {
							message: "Please enter the correct password for Current Password",
							message1: 0,
							result : row
						});
					}
				});

				}
	});
	}
	else{
	res.redirect('/adminLogin');
	}
	});

	app.post('/editpasswordShippingAdmin', function(req, res) {
	// render the page and pass in any flash data if it exists
	sess=req.session;
	if(sess.Adminusername){
		connection.query("SELECT * FROM administrator WHERE Username = ?",[req.body.username], function(err, rows) {
				if (rows.length) {
					res.render('editprofileShippingAdmin.ejs', {
						message: "Username exists.Please enter another username.",
						message1: 0,
						result : rows
					});
				}
				else{
							connection.query("SELECT * FROM administrator WHERE AdminID = ?",[sess.AdminID], function(err, row) {
					if (bcrypt.compareSync(req.body.Curpassword, row[0].Password)){
						console.log("Password confirmation OK");
						connection.query("UPDATE administrator SET Password=? WHERE AdminID = ? ",[bcrypt.hashSync(req.body.password, null, null),sess.AdminID],function(err, rows){
							res.render('editprofileShippingAdmin.ejs', {
								message: "Congratulations ! Details were Updated Successfully.",
								message1: 0,
								result : row
							});
						});
					}

					else{
						res.render('editprofileShippingAdmin.ejs', {
							message: "Please enter the correct password for Current Password",
							message1: 0,
							result : row
						});
					}
				});

				}
	});
	}
	else{
	res.redirect('/adminLogin');
	}
	});
//render the admin login
		app.get('/adminLogin', function(req, res) {
			// render the page and pass in any flash data if it exists
			res.render('adminLogin.ejs', { message: req.flash('loginMessage') })
		});

		// process the admin login form
		app.post('/adminLogin', passport.authenticate('local-adminLogin', {
	            successRedirect : '/dashboard', // redirect to the secure profile section
	            failureRedirect : '/adminLogin', // redirect back to the signup page if there is an error
	            failureFlash : true // allow flash messages
			}),
	        function(req, res) {
	            if (req.body.remember) {
	              req.session.cookie.maxAge = 1000 * 60 * 5;
	            } else {
	              req.session.cookie.expires = false;
	            }
	        res.redirect('/');
	    });

	// get the login form  shipping admin
			app.get('/shipAdminLogin', function(req, res) {
				// render the page and pass in any flash data if it exists
				res.render('shipAdminLogin.ejs', { message: req.flash('loginMessage') });
			});

			// process the login form of shipping admin
			app.post('/shipAdminLogin', passport.authenticate('local-adminLogin', {
		            successRedirect : '/shippingDashboard', // redirect to the secure profile section
		            failureRedirect : '/shipAdminLogin', // redirect back to the signup page if there is an error
		            failureFlash : true // allow flash messages
				}),
		        function(req, res) {
		            console.log("hello");
		            if (req.body.remember) {
		              req.session.cookie.maxAge = 1000 * 60 * 5;
		            } else {
		              req.session.cookie.expires = false;
		            }
		        res.redirect('/');
		    });



	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/Adminsignup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('Adminsignup.ejs', { message: req.flash('AdminsignupMessage') });
	});

	// process the signup form
	app.post('/Adminsignup', passport.authenticate('local-Adminsignup', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/Adminsignup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.get('/shipAdminsignup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('shipAdminsignup.ejs', { message: req.flash('AdminsignupMessage') });
	});


	app.post('/shipAdminsignup', passport.authenticate('local-Adminsignup', {
		successRedirect : '/shippingDashboard', // redirect to the secure profile section
		failureRedirect : '/shipAdminsignup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/search', function(req, res, next) {
		sess=req.session;
	 connection.query('SELECT * FROM product where category = ? AND (PName LIKE ? OR Description LIKE ?) ',[req.body.categ, '%' + req.body.searcht+ '%', '%' + req.body.searcht+ '%' ] ,function(err, row){
		 connection.query('SELECT * FROM category',function(err, result){
if(!err){
			res.render('search',{
				skey : req.body.searcht,
				userds : row,
				result : result,
				categ : req.body.categ
			});
		}
  });
	  });
	});


	app.post('/Adminsearch', function(req, res, next) {
		sess=req.session;
	 connection.query('SELECT * FROM product JOIN proSizes ON	product.PID=proSizes.PID where PName LIKE ? ',[ '%' + req.body.searcht+ '%'] ,function(err, row){

if(!err){
			res.render('Adminsearch.ejs',{
				result : row,
				skey : req.body.searcht
			});
		}
	  });

	});

	app.get('/proDetails', function(req, res, next) {
		// render the page and pass in any flash data if it exists
			 var id = req.query.id;
			 sess=req.session;
			 sess.idn = id;

		connection.query('SELECT * FROM product where PID = ?',[id] ,function(err, rows){
			connection.query('SELECT distinct Size FROM proSizes where PID = ?',[sess.idn] ,function(err, row1){
				connection.query('SELECT distinct Colour FROM proSizes where PID = ? AND Size = ?',[sess.idn,row1[0].Size] ,function(err, row2){
	 if(!err){
		 var newPrice=parseFloat(rows[0].MPrice)-(parseFloat(rows[0].MPrice)*parseFloat(rows[0].discount))/100;
		 sess.NPrice= newPrice;
 		res.render('proDetails',{
			prod : rows,
			newPrice : newPrice,
			result1 : row1,
			result2 : row2,
			size : 0
 		});
			 }
});
});
			});
	});

	app.get('/proDetails2', function(req, res, next){
		// render the page and pass in any flash data if it exists
			 var size = req.query.size;
			 sess=req.session;
		connection.query('SELECT * FROM product where PID = ?',[sess.idn] ,function(err, rows){
			connection.query('SELECT distinct Size FROM proSizes where PID = ?',[sess.idn] ,function(err, row1){
				connection.query('SELECT distinct Colour FROM proSizes where PID = ? AND Size = ?',[sess.idn,size] ,function(err, row2){
	 if(!err){
		 var newPrice=parseFloat(rows[0].MPrice)-(parseFloat(rows[0].MPrice)*parseFloat(rows[0].discount))/100;
		 sess.NPrice= newPrice;
		res.render('proDetails',{
			prod : rows,
			newPrice : newPrice,
			result1 : row1,
			result2 : row2,
			size : size
		});
			 }
});
});
			});
	});


	app.post('/adedCart', function(req, res, next) {
		sess=req.session;
	if(sess.username)
	{
		var insertQuery = "INSERT INTO cart(CID,PID,Quantity,CSize,CColour) values (?,?,?,?,?)";
		connection.query(insertQuery,[sess.CID, sess.idn, req.body.quantity, req.body.Size, req.body.Colour],function(err, rows) {
				 if(!err){
			res.redirect('cart');
		}
		else {
			console.log("Error");
		}
		});
	}

else{
res.render('login',{ message: req.flash('loginMessage') });
}

	});


	app.get('/cart', function(req, res, next) {
sess=req.session;
if(sess.username)
{
	connection.query('SELECT * FROM cart,product where cart.PID=product.PID AND CID = ?',[ sess.CID ] ,function(err, rows){
	if(!err){
			res.render('cart',{
				crtdetail : rows
			});
		}
		else {
			console.log("Error in db");
		}
	});

}

else{
res.render('login',{ message: req.flash('loginMessage') });
}
	});


		app.get('/promotions', function(req, res, next) {
	sess=req.session;
	if(sess.username)
	{
		connection.query('SELECT * FROM promotion where CID = ?',[ sess.CID ] ,function(err, rows){
		if(!err){
				res.render('promo',{
					result : rows
				});
			}
			else {
				console.log("Error in db");
			}
		});
	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
		});


		app.get('/summary', function(req, res, next) {
	sess=req.session;
	if(sess.username)
	{
		var dt = dateTime.create();
		var formatY = dt.format('Y');
		var formatM = dt.format('m');
		if(parseInt(formatM) == 1){
			newMonth = 12;
			newYear = parseInt(formatY) - 1
	}
		else{
			newMonth =  parseInt(formatM) - 1;
			newYear = formatY;
		}

		if(parseInt(formatM) == 12){
			newMonthE = 1;
			newYearE = parseInt(formatY) + 1
	}
		else{
			newMonthE =  parseInt(formatM) + 1;
			newYearE = formatY;
		}
		var date = (newYear + '-' + newMonth);
		var dateE = (newYearE + '-' + newMonthE);
		connection.query('SELECT * FROM ordershipping JOIN orderdetails ON	ordershipping.OrderID=orderdetails.OrderID JOIN product ON orderdetails.PID=product.PID  JOIN ordert ON orderdetails.OrderID=ordert.OrderID where CID = ? AND shipStatus= "Shipped" AND DeliveryDate BETWEEN ? AND ?',[ sess.CID,date,dateE ] ,function(err, rows){
			connection.query('SELECT * FROM ordershipping JOIN orderdetails ON	ordershipping.OrderID=orderdetails.OrderID JOIN product ON orderdetails.PID=product.PID  JOIN ordert ON orderdetails.OrderID=ordert.OrderID where CID = ? AND shipStatus= "Not Shipped"',[ sess.CID ] ,function(err, row){
		if(!err){
				res.render('summary',{
					result : rows,
					result2 : row
				});
			}
			else {
				console.log("Error in db");
			}
		});
		});
	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
		});

				app.get('/promoPay', function(req, res, next) {
			sess=req.session;
			if(sess.username)
			{
				var rate;
				 request('http://www.apilayer.net/api/live?access_key=b96a02c02a7f42e53e24e7ccb1285908&currencies=LKR%20&%20format=1', { json: true }, (err, res, body) => {
					if (err) { return console.log(err); }
							rate = body.quotes.USDLKR;
		currency(rate);
		});

			function currency(vari){
				console.log("vari" + vari);
				tot = parseFloat(req.query.tot);
					var insertQuery = "INSERT INTO promohistory(promoCode,CID,promoAmount,promoRemain) values (?,?,?,?)";
				connection.query('SELECT * FROM promotion where CID = ?',[ sess.CID ] ,function(err, rows){
						connection.query('SELECT * FROM shipping where ShippingID = ?',[sess.shipID ],function(err, results){

				if(!err){
					if(!check.emptyArray(rows)){
						if(tot>rows[0].proAmnt){
						tot -= parseFloat(rows[0].proAmnt);
						connection.query(insertQuery,[rows[0].promotionCode,sess.CID, rows[0].proAmnt, '0'],function(err, row) {
							connection.query('DELETE FROM promotion where promotionID = ?',[rows[0].promotionID] ,function(err, rowss){

							});
						});

					}
					else{
						totN = parseFloat(rows[0].proAmnt) - tot;
						var x = tot;
						tot -= parseFloat(rows[0].proAmnt);
						connection.query(insertQuery,[rows[0].promotionCode,sess.CID,rows[0].proAmnt, x],function(err, row) {
							connection.query('UPDATE promotion SET proAmnt =?',[totN] ,function(err, rowss){
							});
						});
					}
		 }
		 if(tot>0){
						res.render('promoPay',{
							result1 : rows,
							result :results,
							fTot : tot,
							total : req.query.tot,
							curr : vari
						});
					}
			else {
				 res.render('purchased');
			}
					}
				});
			});
			}
		}
			else{
			res.render('login',{ message: req.flash('loginMessage') });
			}
				});


	app.get('/CRemove', function(req, res, next) {
		sess=req.session;
		if(sess.username)
		{
		 var cartid = req.query.cartid;
		  console.log(cartid);
	connection.query('DELETE FROM cart where CartId = ?',[cartid ] ,function(err, rows){
	if(!err){
			res.redirect('cart');
		}
		else {
			console.log("Error in db");
				}
			});
		}
		else{
			res.render('login',{ message: req.flash('loginMessage') });
		}
	});

	app.get('/checkOut', function(req, res, next) {
		sess=req.session;
		if(sess.username)
		{
		 var id = req.query.id;

	connection.query('SELECT * FROM cart where CartId = ?',[id] ,function(err, rows){
	if(!err){
		connection.query('DELETE FROM cart where CartId = ?',[id] ,function(err, row){
			connection.query('SELECT * FROM product where PID = ?',[rows[0].PID] ,function(err, result){
				 sess.idn = rows[0].PID;
				connection.query('SELECT distinct Size FROM proSizes where PID = ?',[rows[0].PID] ,function(err, results){
					connection.query('SELECT distinct Colour FROM proSizes where PID = ? AND Size = ?',[rows[0].PID,results[0].Size] ,function(err, reslt){
		 if(!err){
			 var newPrice=parseFloat(result[0].MPrice)-(parseFloat(result[0].MPrice)*parseFloat(result[0].discount))/100;
			 sess.NPrice= newPrice;
	 		res.render('proDetails',{
				prod : result,
				result1 : results,
				result2 : reslt,
				newPrice : newPrice,
				size : 0
	 		});
				 }
			});
				});
					});
					});
		}
		else{
			console.log("Error in db");
				}
			});

		}
		else{
			res.render('login',{ message: req.flash('loginMessage') });
		}
	});


	app.get('/updateItemStock', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
		connection.query('SELECT * FROM category ',function(err, rows){
			connection.query('SELECT distinct Colour FROM proSizes ',function(err, reslt){
					connection.query('SELECT distinct Size FROM proSizes ',function(err, reslts){
						connection.query('SELECT distinct Brand FROM product ',function(err, results){
							connection.query('SELECT distinct Company FROM vendor ',function(err, row){
		if(!err){
			res.render('updateItemStock',{
				result6 : row,
				result5 : results,
					result3 : reslts,
						result4 : reslt,
				result : rows
			});
		}
		else {
			console.log("Error");
		}
		});
		});
		});
			});
	});
}
else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
	});


	app.get('/addSizes', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{

			connection.query('SELECT distinct Colour FROM proSizes ',function(err, reslt){
					connection.query('SELECT distinct Size FROM proSizes ',function(err, reslts){
						connection.query('SELECT * FROM product ',function(err, rows){
		if(!err){
			res.render('addSizes',{
					result3 : reslts,
						result4 : reslt,
				result : rows
			});
		}
		else {
			console.log("Error");
		}
		});
			});
			});
}
else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
	});


	app.post('/addSizes', function (req, res) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{

									var insertQuery = "INSERT INTO proSizes(PID, Size, Colour, StockAmnt) values (?,?,?,?)";

										var size, colour;
									 if(req.body.SizeL == "Other"){
												size = req.body.Size;
									 }
									 else {
										size = req.body.SizeL;
									 }

									 if(req.body.ColourL == "Other"){
											 colour = req.body.Colour;
									}
									else {
									 colour = req.body.ColourL;
									}
														connection.query(insertQuery,[req.body.selectProd,size, colour,req.body.StockAmnt],function(err, rows) {
												 if(err){
											console.log("Error");
										}
										res.redirect('dashboard');

										});

	}
	else{
	res.render('adminLogin',{ message: req.flash('loginMessage') });
	}
	});


	app.post('/removeItem', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
		var pid = req.query.pid;
	connection.query('DELETE FROM proSizes where PID = ? AND Size',[pid,req.body.size] ,function(err, rows){
	if(!err){
			res.redirect('dashboard');
		}
		else {
			console.log("Error in db");
		}
	});
}
else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
	});


	app.post('/removeCategory', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
	connection.query('DELETE FROM category where CategoryName = ?',[req.body.item2] ,function(err, rows){
	if(!err){
		connection.query('SELECT * FROM category',function(err, result){
		 res.render('addCategory',{
			 result1 : result,
			 message : "Category was Removed Successfully..!!"
		 });
		 });
		}
		else {
			console.log("Error in db");
		}
	});
}
else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
	});


	app.get('/addCategory', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
		connection.query('SELECT * FROM category',function(err, result){
			res.render('addCategory',{
				result1 : result,
				message : 0
			});
			});
		}

else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
	});


	app.post('/addCategory', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
		var insertQuery = "INSERT INTO category(CategoryName,CatDescription) values (?,?)";

		connection.query(insertQuery,[req.body.category, req.body.categoryDes],function(err, rows) {
				 if(!err){
					 connection.query('SELECT * FROM category',function(err, result){
		 				res.render('addCategory',{
		 					result1 : result,
		 					message : "Category was added Successfully..!!"
		 				});
		 				});
		}
		else {
			console.log("Error");
		}
		});
	}

	else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
	}
	});



	app.post('/updateItemStock', function (req, res) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
			if (!req.files)
				return res.status(400).send('No files were uploaded.');
		var file = req.files.PImage;

		var img_name=file.name;

	  	 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
              file.mv('public/images/uploads/'+file.name, function(err) {
	              if (err)
	                return res.status(500).send(err);

									var insertQuery = "INSERT INTO product (MPrice, PName, Description,ProductImage, reorderLevel, Brand, category, AdminID,CategoryID,VID,discount) values (?,?,?,?,?,?,?,?,?,?,?)";
									var insertQuery2 = "INSERT INTO proSizes (StockAmnt,Size, Colour,PID) values (?,?,?,?)";

									  var size, colour;
									 if(req.body.SizeL == "Other"){
										 		size = req.body.Size;
									 }
									 else {
									 	size = req.body.SizeL;
									 }

									 if(req.body.ColourL == "Other"){
											 colour = req.body.Colour;
									}
									else {
									 colour = req.body.ColourL;
									}

									if(req.body.BrandL == "Other"){
											brand = req.body.Brand;
								 }
								 else {
									brand = req.body.BrandL;
								 }
								 			connection.query('SELECT * FROM category where CategoryName = ?',[req.body.selectCategory],function(err, results){
												connection.query('SELECT * FROM vendor where Company = ?',[req.body.vendorL],function(err, reslt){
														connection.query(insertQuery,[req.body.MPrice,req.body.PName,req.body.Description,img_name ,req.body.reorderLevel,brand, req.body.selectCategory,sess.AdminID,results[0].CategoryID,reslt[0].VID,req.body.discount],function(err, rows) {
																connection.query('SELECT * FROM product where PName = ?',[req.body.PName],function(err, Nresult){
																		connection.query(insertQuery2,[req.body.StockAmnt, size, colour, Nresult[0].PID],function(err, row) {
												 if(err){
											console.log("Error");
										}
										res.redirect('dashboard');
								});
								});
								});
								});
										});
					   });
          } else {

            return res.status(400).send("This format is not allowed , please upload file with '.png','.gif','.jpg'");
          }
}
	else{
	res.render('adminLogin',{ message: req.flash('loginMessage') });
	}
	});


	app.get('/checkoutAll', function(req, res, next) {
		sess=req.session;
	if(sess.username)
	{
		var Price = 0,temp=0;
		var Tot = 0;
		var availability = 1;
		var rate;

				 request('http://www.apilayer.net/api/live?access_key=b96a02c02a7f42e53e24e7ccb1285908&currencies=LKR%20&%20format=1', { json: true }, (err, res, body) => {
					if (err) { return console.log(err); }
							rate = body.quotes.USDLKR;
		currency(rate);
		});

			function currency(x){
				var y;
		connection.query('SELECT * FROM cart JOIN product ON	cart.PID = product.PID where CID = ?',[sess.CID],function(err, results){

				  results.forEach( function( results ){
						connection.query('SELECT * FROM proSizes where PID = ? AND Size = ? AND Colour = ?',[results.PID, results.CSize, results.CColour],function(err, result){
							if(!check.emptyArray(result)){
								if(results.Quantity<=result[0].StockAmnt){
									availability *= 1;
								}
								else{
									availability *= 0;
								}
							}
						else{
								availability *= 0;
							}
						Price += parseFloat(results.MPrice)*parseFloat(results.Quantity);
						temp++;
					});
					});


					if(availability==1){
			connection.query('SELECT * FROM shipping where ShippingID = ?',[req.query.ShippingID],function(err, result){
				 if(!err){
					 Tot = Price + temp*parseFloat(result[0].shippingCost);
					 res.render('CheckAllshipping2', {
			 			result : result,
						price : Tot,
						message : 0,
						currValue : x
					});
		}
		else
			console.log("Error");
	});
}
else{
	connection.query('SELECT * FROM shipping where ShippingID = ?',[req.query.ShippingID],function(err, result){
		 if(!err){
			 Tot = Price + temp*parseFloat(result[0].shippingCost);
			 res.render('CheckAllshipping2', {
				result : result,
				price : Tot,
				currValue : x,
				message : "Sorry Stocks have been finished by now..!!"
			});
}
else
	console.log("Error");
});
}

	});
}
	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
	});


	app.post('/checkAllShipping', function(req, res, next) {
		sess=req.session;
	if(sess.username)
	{
		connection.query('SELECT * FROM shipping',function(err, results){
				 if(!err){
					 res.render('shippingCheckAll', {
			 			result : results
					});
		}
		else
			console.log("Error");
	});
	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
	});


	app.post('/shipping', function(req, res, next) {
		sess=req.session;
	if(sess.username)
	{
		var availability = 0;
		sess.pID = req.query.PID;
		 sess.size = req.body.Size;
		 	sess.colour = req.body.Colour;
		sess.quantity =  req.body.quantity;
	connection.query('SELECT * FROM proSizes where PID = ?',[sess.pID],function(err, result){
		connection.query('SELECT * FROM shipping',function(err, results){
				 if(!err){
					 result.forEach( function( result ){
					 if(sess.quantity<=result.StockAmnt && result.Size==sess.size && result.Colour==sess.colour){
							 availability += 1;
						 }
						 else{
								 availability += 0;
							 }
						 });
						 if(availability==1){
					 res.render('shipping', {
			 			result : results,
						message : 0
					});
				}

				else{
			res.render('shipping', {
			 result : results,
			 message : "Sorry Stocks have been finished by now..!!"
		 });
	 }
		}
		else
			console.log("Error");
	});
	});
	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
	});


	app.get('/shipping2', function(req, res, next) {
		sess=req.session;
		var value = 0;
		if(sess.username)
		{
		var rate;

		 request('http://www.apilayer.net/api/live?access_key=b96a02c02a7f42e53e24e7ccb1285908&currencies=LKR%20&%20format=1', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
					rate = body.quotes.USDLKR;
currency(rate);
});

	function currency(x){
			var ShipID = req.query.ShippingID;
			sess.shipID = ShipID;
			sess.value = x;
			connection.query('SELECT * FROM product where PID = ?',[sess.pID],function(err, result){
				connection.query('SELECT * FROM shipping where ShippingID = ?',[ShipID],function(err, results){
				 if(!err){
					 console.log(x);
					 res.render('shipping2',{
						result2 : result,
						result : results,
						currValue : x
					});
		}
		else
			console.log("Error");
	});
});

}
	}

	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
	});

	app.get('/paid', function(req, res, next) {
		sess=req.session;
			if(sess.username)
			{
		var dt = dateTime.create();
		var format = dt.format('Y-m-d');
		var formatY = dt.format('Y');
		var formatM = dt.format('m');
		var formatD = dt.format('d');
		var formatted = dt.format('Y-m-d-H:M:S');
		var x = random({start: 100000, end: 1000000});
		var y = formatted + '-' + x[0];
		var PID = req.query.PID;
		if(parseInt(formatM) != 12){
		newMonth =  parseInt(formatM) + 1;
		newYear = formatY;
	}
		else{
			newMonth = 1;
			newYear = parseInt(formatY) + 1
		}
		var date = (newYear + '-' + newMonth + '-' + formatD);

	var updateProduct = 'UPDATE proSizes SET StockAmnt =? WHERE PID = ? AND Size= ? AND Colour= ?';
	var insertOrder = "INSERT INTO ordert(BillID, DeliveryDate, BillingDate) values (?,?,?)";
	var insertOrderDetails = "INSERT INTO orderdetails(PID, OrderID, Quantity, Size, Colour) values (?,?,?,?,?)";
	var insertShippingDetails = "INSERT INTO ordershipping(CID, OrderID, ShippingID, shipStatus,sentForShippingDep) values (?,?,?,?,?)";
	var sum = 0;
console.log(date);
		connection.query('SELECT * FROM proSizes where PID = ? AND Size= ? AND Colour= ?',[PID,sess.size,sess.colour],function(err, results){

		connection.query(updateProduct,[parseInt(results[0].StockAmnt)-parseInt(sess.quantity),PID,sess.size,sess.colour],function(err, rows) {
			connection.query(insertOrder,[y,date,format] ,function(err, rows) {
				connection.query('SELECT * FROM ordert where BillID = ?',[y],function(err, result){
					connection.query(insertOrderDetails,[PID,result[0].OrderID,sess.quantity,sess.size,sess.colour] ,function(err, rows) {
						connection.query(insertShippingDetails,[sess.CID,result[0].OrderID,sess.shipID,"Not Shipped","No"] ,function(err, rows) {
							connection.query('SELECT * FROM orderdetails JOIN ordershipping ON	orderdetails.OrderID=ordershipping.OrderID JOIN product ON orderdetails.PID=product.PID where CID= ?',[sess.CID],function(err, rslt){

				 if(!err){
					    rslt.forEach(function(rslt) {
							sum += parseInt(rslt.MPrice)*parseInt(rslt.Quantity);
				 });
				 console.log(sum);
				 if(sum >=10000){
					 var proAmnt = 1000;
					 connection.query('SELECT * FROM promohistory where CID = ? AND promoAmount = ?',[sess.CID , proAmnt],function(error, value){
						 	 connection.query('SELECT * FROM promotion where CID = ? AND proAmnt = ?',[sess.CID , proAmnt],function(error, num){
				 		if(check.emptyArray(value) && check.emptyArray(num)){
					 var promo = cc.generate();
					  console.log(promo);
					 		connection.query("INSERT INTO promotion(promotionCode, CID, proAmnt) values (?,?,?)",[promo,sess.CID,proAmnt] ,function(err, rows) {
							});
				 }
				  });
					  });
			 }

			 if(sum >=25000){
				  var proAmnt2 = 2500;
					 connection.query('SELECT * FROM promohistory where CID = ? AND promoAmount = ?',[sess.CID , proAmnt2],function(error, values){
						  connection.query('SELECT * FROM promotion where CID = ? AND proAmnt = ?',[sess.CID , proAmnt2],function(error, nums){
					if(check.emptyArray(values) && check.emptyArray(nums)){
				 var promo = cc.generate();
					console.log(promo);
						connection.query("INSERT INTO promotion(promotionCode, CID, proAmnt) values (?,?,?)",[promo,sess.CID,proAmnt2] ,function(err, rows) {
						});
			 }
			 });
			  });
		 }
					 res.render('purchased');
		}
		else
			console.log("Error");

		});
	});
	});

});
});
});
});
	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
	});


	app.get('/paidCheckAll', function(req, res, next) {
		sess=req.session;
			if(sess.username)
			{
				var ship = req.query.shipID;
					var sum = 0;
					var updateProduct = 'UPDATE proSizes SET StockAmnt =? WHERE PID = ? AND Size= ? AND Colour= ?';
					var insertOrder = "INSERT INTO ordert(BillID, DeliveryDate, BillingDate) values (?,?,?)";
					var insertOrderDetails = "INSERT INTO orderdetails(PID, OrderID, Quantity, Size, Colour) values (?,?,?,?,?)";
					var insertShippingDetails = "INSERT INTO ordershipping(CID, OrderID, ShippingID, shipStatus,sentForShippingDep) values (?,?,?,?,?)";

				connection.query('SELECT * FROM cart where CID = ?',[sess.CID],function(err, result1){
								  result1.forEach( function( result1 ) {
		var dt = dateTime.create();
		var format = dt.format('Y-m-d');
		var formatY = dt.format('Y');
		var formatM = dt.format('m');
		var formatD = dt.format('d');
		var formatted = dt.format('Y-m-d-H:M:S');
		var x = random({start: 100000, end: 1000000});
		var y = formatted + '-' + x[0];
		var PID = req.query.PID;
		if(parseInt(formatM) != 12){
		newMonth =  parseInt(formatM) + 1;
		newYear = formatY;
	}
		else{
			newMonth = 1;
			newYear = parseInt(formatY) + 1
		}
		var date = (newYear + '-' + newMonth + '-' + formatD);

console.log(date);

			connection.query('SELECT * FROM proSizes where PID = ? AND Size= ? AND Colour= ?',[PID,sess.size,sess.colour],function(err, results){
		connection.query(updateProduct,[parseInt(results[0].StockAmnt)-parseInt(result1.Quantity),result1.PID,result1.Size,result1.Colour],function(err, rows) {
			connection.query(insertOrder,[y,date,format] ,function(err, rows) {
				connection.query('SELECT * FROM ordert where BillID = ?',[y],function(err, result){
					console.log(result[0].OrderID);
					connection.query(insertOrderDetails,[result1.PID,result[0].OrderID,result1.Quantity,result1.Size,result1.Colour] ,function(err, rows) {
						connection.query(insertShippingDetails,[sess.CID,result[0].OrderID,ship,"Not Shipped","No"] ,function(err, rows) {
							connection.query('SELECT * FROM orderdetails JOIN ordershipping ON	orderdetails.OrderID=ordershipping.OrderID JOIN product ON orderdetails.PID=product.PID where CID= ?',[sess.CID],function(err, rslt){
								sum = 0;
				 if(!err){
							rslt.forEach(function(rslt) {
							sum += parseInt(rslt.MPrice)*parseInt(rslt.Quantity);
				 });
				 console.log(sum);
				 if(sum >=10000){
					var proAmnt = 1000;
					connection.query('SELECT * FROM promohistory where CID = ? AND promoAmount = ?',[sess.CID , proAmnt],function(error, value){
							connection.query('SELECT * FROM promotion where CID = ? AND proAmnt = ?',[sess.CID , proAmnt],function(error, num){
					 if(check.emptyArray(value) && check.emptyArray(num)){
					var promo = cc.generate();
					 console.log(promo);
						 connection.query("INSERT INTO promotion(promotionCode, CID, proAmnt) values (?,?,?)",[promo,sess.CID,proAmnt] ,function(err, rows) {
						 });
				}
				 });
					 });
			}

			if(sum >=25000){
				 var proAmnt2 = 2500;
					connection.query('SELECT * FROM promohistory where CID = ? AND promoAmount = ?',[sess.CID , proAmnt2],function(error, values){
						 connection.query('SELECT * FROM promotion where CID = ? AND proAmnt = ?',[sess.CID , proAmnt2],function(error, nums){
				 if(check.emptyArray(values) && check.emptyArray(nums)){
				var promo = cc.generate();
				 console.log(promo);
					 connection.query("INSERT INTO promotion(promotionCode, CID, proAmnt) values (?,?,?)",[promo,sess.CID,proAmnt2] ,function(err, rows) {
					 });
			}
			});
			 });
		}
		}
		else
			console.log("Error");
		});
	});
	});

});
});
});
});
});
connection.query('DELETE FROM cart',function(err, row){
 res.render('purchased');
 });
});


	}
	else{
	res.render('login',{ message: req.flash('loginMessage') });
	}
	});


	app.get('/updateItem', function(req, res) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{
		connection.query('SELECT * FROM product',function(err, results){
			connection.query('SELECT distinct Size FROM proSizes where PID = ?',[results[0].PID] ,function(err, row1){

		res.render('updateItem.ejs', {
		 result2 :results,
		 result3 :row1,
		 pid : 0
	 });

});
});
}
		else{
	res.render('adminLogin',{ message: req.flash('loginMessage') });
}
});


app.get('/updateItem2', function(req, res) {
	sess=req.session;
if(sess.Adminusername && sess.role=="Admin")
{
	var pid = req.query.PID;
	connection.query('SELECT * FROM product',function(err, results){
		connection.query('SELECT distinct Size FROM proSizes where PID = ?',[pid] ,function(err, row1){
		connection.query('SELECT * FROM category',function(err, result){
	res.render('updateItem.ejs', {
	 result2 :results,
	 result1 :result,
	 result3 :row1,
	 pid : pid
 });
});
});
});
}
	else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
});


app.get('/usage', function(req, res) {
			sess=req.session;
		if(sess.Adminusername && sess.role=="Admin")
		{
			connection.query('SELECT * FROM product',function(err, results){
			res.render('usage.ejs', {
			 result2 :results
		 });
	});
		}
			else{
	res.render('adminLogin',{ message: req.flash('loginMessage') });
	}
	});

	app.post('/updateStock', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{

		var pid = req.query.pid;

		var updatestock = 'UPDATE proSizes SET StockAmnt =? WHERE PID = ? AND Size=?';
connection.query('SELECT * FROM proSizes where PID = ? AND Size=?',[pid, req.body.size] ,function(err, results){
			connection.query(updatestock,[parseInt(results[0].StockAmnt) + parseInt(req.body.orderLevel) ,pid, req.body.size],function(err, rows) {
				 if(!err){
						res.redirect('dashboard');
				}
		else
			console.log("Error");
	});
		});

	}
	else{
	res.render('adminLogin',{ message: req.flash('loginMessage') });
	}
	});


	app.post('/usageR', function(req, res, next) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
	{

	connection.query('SELECT * FROM orderdetails JOIN ordert ON	orderdetails.OrderID=ordert.OrderID JOIN product ON orderdetails.PID=product.PID where PName = ? AND BillingDate BETWEEN ? AND ?',[req.body.item , req.body.startDate , req.body.endDate ] ,function(err, rows){
		console.log(rows[0]);
	if(!err){
		res.render('usageR.ejs', {
		 result :rows,
		 start:req.body.startDate,
		 end:req.body.endDate,
		 item:req.body.item
		});
		}
	});

}
else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
}
	});

	app.get('/reqInventory', function(req, res) {
				sess=req.session;
			if(sess.Adminusername && sess.role=="Admin")
			{
				connection.query('SELECT distinct PName FROM product',function(err, rows){
				connection.query('SELECT distinct Company FROM vendor',function(err, results){
						connection.query('SELECT distinct CategoryName  FROM category',function(err, result){
				res.render('reqInventory.ejs', {
					result2 : result,
				 result1 :results,
				 result3 : rows
			 });
		 });
		  });
			 });
			}
				else{
res.render('adminLogin',{ message: req.flash('loginMessage') });
		}
		});


		app.post('/reqInventory', function(req, res) {
					sess=req.session;
				if(sess.Adminusername && sess.role=="Admin")
				{
					var body =  'Dear Seller,'+'\n'+ 'After reviewing all the tenders submitted by different organizations, we have selected your company for the order of following product,'+'\n'+ 'Product Name : '+ req.body.proName +' with Product Colour : '+req.body.pColour+' and Product Size : ' +req.body.pSize +'\n'+'Product Brand : ' + req.body.pBrand + ' and Product Quantity : ' + req.body.pQuantity +'\n'+' We are also enclosing the terms and conditions for your consideration. If you need any clarifications regarding the same, please feel free to contact us.We would appreciate if you could start the manufacturing at the earliest and deliver the goods to our warehouse(codebreaker retail shop) in Katubedda. Also, please let us know the price for doing the payment to goods.' +'\n'+'Thank you - Hotline:0775313704';
					connection.query('SELECT * FROM vendor where Company = ?',[req.body.compName],function(err, results){
						var mailOptions={
							to : results[0].Email,
							subject : "Request for goods",
							text : body
						}
						console.log(mailOptions);
						smtpTransport.sendMail(mailOptions, function(error, response){
					   	 if(error){
					        	console.log(error);
						 }else{
					        	console.log("Message sent: " + response.message);
					    	 }
					});
					connection.query("INSERT INTO stockrequest(vName, catName, proName,proSize,proColour,proQuantity,proBrand,adminID,status) values (?,?,?,?,?,?,?,?,?)",[req.body.compName,req.body.catName,req.body.proName,req.body.pSize,req.body.pColour,req.body.pQuantity,req.body.pBrand,sess.AdminID,"Not Recieved"] ,function(err, rows) {
					res.redirect('/dashboard');
			 });
			  });
				}
					else{
				res.render('adminLogin',{ message: req.flash('loginMessage') });
			}
			});


		app.get('/addVendor', function(req, res) {
					sess=req.session;
				if(sess.Adminusername && sess.role=="Admin")
				{
					res.render('addVendor.ejs');
				}
					else{
				res.render('adminLogin',{ message: req.flash('loginMessage') });
			}
			});

			app.post('/editVendor', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
					{
						var vendor = req.query.vendor;

						connection.query('SELECT * FROM vendor where VID = ?',[vendor],function(err, results){

						res.render('updateVendor.ejs', {
						 result2 :results
					 });
				});
					}
						else{
					res.render('adminLogin',{ message: req.flash('loginMessage') });
				}
				});

			app.get('/vendorDetails', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
					{
						connection.query('SELECT * FROM vendor',function(err, results){
						res.render('vendorDetails.ejs', {
						 result2 :results
					 });
				});
					}
						else{
					res.render('adminLogin',{ message: req.flash('loginMessage') });
				}
				});



			app.post('/addVendor', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
					{
						connection.query("INSERT INTO vendor(Company, Address, Email, Name) values (?,?,?,?)",[req.body.compName,req.body.address,req.body.email,req.body.vName] ,function(err, rows) {
						res.redirect('/vendorDetails');
				});
					}
						else{
					res.render('adminLogin',{ message: req.flash('loginMessage') });
				}
				});

				app.post('/updateVendor', function(req, res) {
							sess=req.session;
						if(sess.Adminusername && sess.role=="Admin")
						{
							connection.query("UPDATE vendor SET Company = ?, Address = ?, Email = ?, Name = ? where VID = ? ",[req.body.compName,req.body.address,req.body.email,req.body.vName,req.query.vid] ,function(err, rows) {
							res.redirect('/vendorDetails');
					});
						}
							else{
						res.render('adminLogin',{ message: req.flash('loginMessage') });
					}
					});

				app.post('/removeVendor', function(req, res) {
							sess=req.session;
						if(sess.Adminusername && sess.role=="Admin")
						{
							connection.query("DELETE FROM vendor where VID = ?",[req.query.vendor] ,function(err, rows) {
							res.redirect('/vendorDetails');
					});
						}
							else{
							res.render('adminLogin',{ message: req.flash('loginMessage') });
					}
					});




					app.get('/invReqHistory', function(req, res) {
							sess=req.session;
						if(sess.Adminusername && sess.role=="Admin")
						{
							connection.query('SELECT * FROM stockrequest',function(err, rows){
								if(!err){
							res.render('invReqHistory.ejs',{
								result : rows
							});
						}
					});
				}
					else{
					res.render('adminLogin',{ message: req.flash('loginMessage') });
				}
					});

					app.post('/invReqHistory', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
					{
							var dt = dateTime.create();
							var format = dt.format('Y-m-d-H:M:S');
						connection.query('UPDATE stockrequest SET status = ?, recievedDate = ? where reqID = ?',["Recieved",format,req.query.ReqID],function(err, rows){
								if(!err){
							res.redirect('/invReqHistory');
						}
					});
				}
					else{
					res.render('adminLogin',{ message: req.flash('loginMessage') });
				}
					});


app.get('/removeAdmin', function(req, res) {
		sess=req.session;
	if(sess.Adminusername && sess.role=="Admin")
		{
		connection.query('SELECT * FROM administrator where role=?',["Admin"],function(err, rows){
		if(!err){
		res.render('removeAdmin.ejs',{
			result : rows
					});
				}
			});
				}
		else{
			res.render('adminLogin',{ message: req.flash('loginMessage') });
				}
				});


				app.post('/removeAdmin', function(req, res) {
						sess=req.session;
					if(sess.Adminusername && sess.role=="Admin")
						{
							connection.query('SELECT * FROM administrator where Username=?',[req.body.item],function(err, row){
						connection.query('DELETE FROM administrator where Username=?',[req.body.item],function(err, rows){
						if(!err){
						res.render('removedAdmin.ejs',{
							result : row
									});
								}
							});
								});
								}
						else{
							res.render('adminLogin',{ message: req.flash('loginMessage') });
								}
								});


							app.get('/shipRequests', function(req, res) {
									sess=req.session;
								if(sess.Adminusername && sess.role=="Admin")
								{
									var i;

									connection.query('SELECT * FROM ordert JOIN ordershipping ON	ordert.OrderID=ordershipping.OrderID where shipStatus = ? AND sentForShippingDep = ? group BY BillingDate',["Not Shipped","No"],function(err, row){

										connection.query('SELECT * FROM orderdetails JOIN ordershipping ON	orderdetails.OrderID=ordershipping.OrderID JOIN product ON orderdetails.PID=product.PID JOIN ordert ON orderdetails.OrderID=ordert.OrderID where shipStatus = ? AND sentForShippingDep = ?',["Not Shipped","No"],function(err, rows){

										if(!err){

									res.render('shipRequests.ejs',{
										result1 : row,
										result2 : rows
									});
								}
							});
							});
						}
							else{
						res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
						}
							});


							app.post('/shipRequests', function(req, res) {
								sess=req.session;
							if(sess.Adminusername && sess.role=="Admin")
							{

								connection.query('UPDATE ordershipping SET sentForShippingDep = ? where OrderID = ?',["Yes",req.query.OID],function(err, rows){
										if(!err){
									res.redirect('/shipRequests');
								}
							});
						}
							else{
						res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
					}
							});


							app.get('/discount', function(req, res) {
								sess=req.session;
							if(sess.Adminusername && sess.role=="Admin")
							{
								connection.query('SELECT * FROM product',function(err, results){
									connection.query('SELECT * FROM product where PID = ?',[results[0].PID],function(err, result){
								res.render('discount.ejs', {
									 result1 :result,
								 result2 :results,
								 pid : 0
							 });
							  });
							});

							}
								else{
								res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
							}
							});


							app.get('/discount2', function(req, res) {
								sess=req.session;
							if(sess.Adminusername && sess.role=="Admin")
							{
								var pid = req.query.PID;
								connection.query('SELECT * FROM product',function(err, results){
									connection.query('SELECT * FROM product where PID = ?',[pid],function(err, result){
								res.render('discount.ejs', {
									 result1 :result,
								 result2 :results,
								 pid : pid
							 });
								});
							});

							}
								else{
								res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
							}
							});



								app.post('/discount', function(req, res, next) {
									sess=req.session;
								if(sess.Adminusername  && sess.role=="Admin")
								{
									var updateDiscount = 'UPDATE product SET discount =? WHERE PID = ?';
							connection.query('SELECT * FROM product where PID = ?',[req.query.pid] ,function(err, results){
										connection.query(updateDiscount,[req.body.discount ,req.query.pid],function(err, rows) {
											 if(!err){
													res.redirect('discount');
											}
									else
										console.log("Error");
								});
									});

								}
								else{
									res.render('adminLogin.ejs',{ message: req.flash('loginMessage') } ); // load the index.ejs file
								}
								});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {

	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/');
		}
	});

	});

	app.get('/logoutAdmin', function(req, res) {

	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/dashboard');
		}
	});

	});

	app.get('/logoutShippingAdmin', function(req, res) {

	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			res.redirect('/shippingDashboard');
		}
	});

	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
