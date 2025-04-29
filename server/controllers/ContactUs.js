const mailSender = require("../utils/mailSender");

exports.contactUs = async (req, res) => {
  const { firstName, lastName, email, message, phoneNo } = req.body;
  if (!firstName || !email || !message) {
    return res.status(403).send({
      success: false,
      message: "All Fields are required",
    });
  }
  try {
    const data = {
      firstName,
      lastName: `${lastName ? lastName : "null"}`,
      email,
      message,
      phoneNo: `${phoneNo ? phoneNo : "null"}`,
    };
    const info = await mailSender(
      process.env.CONTACT_MAIL,
      "Enquery",
      `<html><body>
      ${Object.keys(data).map((key) => {
        return 
        `<p>${key} : ${data[key]}</p>`;
        //<p>firstName : Aisha</p>

      })}
      </body></html>`
    );
    //Object.keys(data) produces an array of the property names: ["firstName","lastName",...].
    //.map() loops over that array and returns a <p> element for each field
    if (info) {
      return res.status(200).send({
        success: true,
        message: "Your message has been sent successfully",
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    return res.status(403).send({
      success: false,
      message: "Something went wrong",
    });
  }
};