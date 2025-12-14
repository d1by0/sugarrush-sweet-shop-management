const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");


//Get user info
const getUserController = async (req, res) => {
    try {
        //find the user
        const user = await userModel.findById(req.user.id); //0 means - hide the attribute and value
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User Not Found"
            })
        }
        //hide the password
        user.password = undefined
        //response
        res.status(200).send({
            success:true,
            message:"Use GET successful",
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in GET User API",
            error
        })
        
    }
};

//update user
const updateUserController = async (req,res) =>{
    try {
        //find user
        const user = await userModel.findById(req.user.id)
        //validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }
        //update
        const {userName,address,phone} = req.body
        if(userName) user.userName = userName
        if (address) user.address = Array.isArray(address) ? address : [address];
        if(phone) user.phone = phone
        //save the details
        await user.save();
        res.status(200).send({
            success:true,
            message:"User details updated successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in updating the User API",
            error
        })
    }

}

//update password
const updatePasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // validation
        if (!oldPassword || !newPassword) {
            return res.status(400).send({
                success: false,
                message: "Old password and new password are required",
            });
        }

        // find user by token id
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.status(200).send({
            success: true,
            message: "Password updated successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in update password API",
            error,
        });
    }
};

//reset password
const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword, answer } = req.body;

        // validation
        if (!email || !newPassword || !answer) {
            return res.status(400).send({
                success: false,
                message: "Email, new password and answer are required",
            });
        }

        // find user by email & answer
        const user = await userModel.findOne({ email, answer });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or answer",
            });
        }

        // hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).send({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in reset password API",
            error,
        });
    }
};

//delete user profile
const deleteUserController = async (req, res) => {
    try {
        // find user by token id
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // delete user
        await userModel.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in delete user API",
            error,
        });
    }
};

//get admin
const getAllAdminsController = async (req, res) => {
    try {
        const admins = await userModel.find({ usertype: "admin" }).select("-password");

        res.status(200).send({
            success: true,
            admins,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching admins",
        });
    }
};

// PROMOTE USER TO ADMIN
const promoteToAdminController = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        user.usertype = "admin";
        await user.save();

        res.status(200).send({
            success: true,
            message: "User promoted to admin successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error promoting user to admin",
        });
    }
};


//update admin
const updateAdminController = async (req, res) => {
    try {
        const { userName, phone, address } = req.body;

        const admin = await userModel.findById(req.params.id);
        if (!admin || admin.usertype !== "admin") {
            return res.status(404).send({
                success: false,
                message: "Admin not found",
            });
        }

        if (userName) admin.userName = userName;
        if (phone) admin.phone = phone;
        if (address) admin.address = address;

        await admin.save();

        res.status(200).send({
            success: true,
            message: "Admin updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating admin",
        });
    }
};

//reset admin password

const resetAdminPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        const admin = await userModel.findOne({
            email,
            answer,
            usertype: "admin",
        });

        if (!admin) {
            return res.status(404).send({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.status(200).send({
            success: true,
            message: "Admin password reset successful",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error resetting admin password",
        });
    }
};

//update admin password
const updateAdminPasswordController = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const admin = await userModel.findById(req.user.id);

        if (!admin || admin.usertype !== "admin") {
            return res.status(403).send({
                success: false,
                message: "Admin access required",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Old password incorrect",
            });
        }

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        await admin.save();

        res.status(200).send({
            success: true,
            message: "Admin password updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating admin password",
        });
    }
};

//delet admin account
const deleteAdminController = async (req, res) => {
    try {
        const admin = await userModel.findById(req.params.id);

        if (!admin || admin.usertype !== "admin") {
            return res.status(404).send({
                success: false,
                message: "Admin not found",
            });
        }

        await userModel.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            message: "Admin deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting admin",
        });
    }
};



module.exports = {getUserController, updateUserController, resetPasswordController, updatePasswordController, deleteUserController, getAllAdminsController,
    updateAdminController,
    resetAdminPasswordController,
    updateAdminPasswordController,
    deleteAdminController,promoteToAdminController};