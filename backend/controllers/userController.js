import { response } from "express"
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import moment from "moment"
import User from "../models/userModel.js"

export const getCurrentUser = async (req, res)=>{
    try {
        const userId = req.userId
        console.log(userId)
        const user = await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({
                message: "User Not founddd",
                success: false
            })
        }
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: "Get current user error",
            success: false
        })
    }
}

// export const updateAssistant = async (req, res)=>{
//     try {
//         const {assistantName, imageUrl} = req.body
//         let assistantImage

//         // input image
//         if(req.file){
//             assistantImage = await uploadOnCloudinary(req.file.path)
//         }
//         else{
//             assistantImage = imageUrl
//         }

//         const user = await User.findByIdAndUpdate(req.userId , {assistantName, assistantImage}, {new:true}).select("-password")

//         return res.status(200).json({
//             user,
//             success: true
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             message: "Update User Error",
//             success: false
//         })
//     }
// }

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;

        if (!req.userId) {
            return res.status(401).json({
                message: "User ID missing. Authentication failed.",
                success: false
            });
        }

        console.log("req.userId:", req.userId);


        // If file uploaded, upload to Cloudinary, else fallback to provided URL
        if (req.file) {
            assistantImage = await uploadOnCloudinary(req.file.path);
        } else {
            assistantImage = imageUrl;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { assistantName, assistantImage },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.error("Error updating assistant:", error.message);
        return res.status(500).json({
            message: "Update User Error",
            success: false,
        });
    }
};


export const askToAssistant = async (req, res)=>{
    try {
        const {command} = req.body
        const user = await User.findById(req.userId);
        user.history.push(command)
        user.save()
        console.log(req.userId)
        const userName = user.name;
        const assistantName = user.assistantName

        const result = await geminiResponse(command, assistantName, userName)

        // const jsonMatch = result.match(/{[\s\s]*}/)
        const jsonMatch = result.match(/{.*}/s); 

        if(!jsonMatch){
            return res.status(400).json({
               response: "Sorry, can't understand"
            })
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type

        // switch(type){
        //     case 'get-date':
        //         return res.json({
        //             type,
        //             userInput: gemResult.userInput,
        //             response: `current date is ${moment().format("YYYY-MM-DD")}`
        //         });
        //     case 'get-time':
        //         return res.json({
        //             type,
        //             userInput: gemResult.userInput,
        //             response: `current time is ${moment().format("hh-mm A")}`
        //         });
        //     case 'get-day':
        //         return res.json({
        //             type,
        //             userInput: gemResult.userInput,
        //             response: `Today is ${moment().format("dddd")}`
        //         })
        //     case 'get-date':
        //         return res.json({
        //             type,
        //             userInput: gemResult.userInput,
        //             response: `Today is ${moment().format("MMMM")}`
        //         });
        //     case 'google_search':
        //     case 'youtube_search':
        //     case 'youtube_play':
        //     case 'general':
        //     case 'calculator_open':
        //     case 'instagram_open':
        //     case 'facebook_open':
        //     case 'weather-show':
        //         return res.json({
        //             type,
        //             userInput: gemResult.userInput,
        //             response: gemResult.response
        //         })

        //         default:
        //         return res.status(400).json({
        //             response: "Sorry, can't understand"
        //         }) 
        // }
        switch (type) {
            case 'get-date':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`
                });
            case 'get-time':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`
                });
            case 'get-day':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format("dddd")}`
                });
            case 'get-month':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format("MMMM")}`
                });
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case 'calculator-open':
            case 'instagram-open':
            case 'facebook-open':
            case 'weather-show':
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response
                });
            default:
                return res.status(400).json({
                    response: "Sorry, can't understand"
                });
        }


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            response: "Ask assistant error"
        })
    }
}