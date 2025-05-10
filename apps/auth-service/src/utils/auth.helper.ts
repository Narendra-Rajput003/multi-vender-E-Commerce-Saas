import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import { NextFunction } from "express";
import { redis } from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const validateRegisterationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phoneNumber, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phoneNumber || !country))
  ) {
    return new ValidationError("Please provide all the required fields");
  }

  if (!emailRegex.test(email)) {
    return new ValidationError("Invalid email");
  }
};


export const CheckOtpRestriction = async (email: string, next: NextFunction) => {


    // if user try to insert invalid otp 3 times 

    if(await redis.get(`otp_lock:${email}`)){
        return next (
            new ValidationError("Account locked due to multiple failed attemps! Try again after 30 minutes")
        )
    }

    


}

export const sendOtp = async (email: string, name:string,template:string) => {

    const otp = crypto.randomInt(1000, 9999).toString();


    await sendEmail(email,'Verify Your Email',template,{name,otp})

    await redis.set(`otp:${email}`,otp,"EX",300);

    /// to prevent the otp spanning . you have to wait for 1 minute for sending another OTP
    await redis.set(`otp_cooldown:${email}`,"true","EX",60)

}