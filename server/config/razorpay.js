const Razorpay=require("razorpay");
//this line imports the razorpay sdk(makes various features(functions)available in ur appln.)(Software development kit)
exports.instance=new Razorpay({//This creates a new Razorpay object using your account details.
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET,
})
//creating instance of razorpay(this is the way to communicate the razorpay). key_id is like the username when u sign up in razorpay it is public. key_secret is like password its secret and private,by these things razorpay knows that its u who is making requests not ur neighbour