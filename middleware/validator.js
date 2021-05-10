const { check } = require("express-validator")

const alphaAndSpace = (string)=> {
    for (i = 0; i < string.length; i++ ) {
        var key = string.charCodeAt(i)
        if ((key >= 33 && key <= 64) || (key >= 91 && key <= 96) || (key >= 123 && key <= 126)){
            return false
        }
    }
    return true
  };
module.exports = {
    loginValidator: (req, res, next) => {

    },
    
    insertDepartmentValidator: () => {
        return [
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên phòng/khoa"),
            check("name").custom( (value, {req}) => {
                return alphaAndSpace(value)
              }).withMessage("Tên phòng/khoa không được chứa số hoặc ký tự đặc biệt"),

            check("email").not().isEmpty().withMessage("Vui lòng nhập email"),
            check("email").isEmail().withMessage("Email không hợp lệ"),

            check("username").not().isEmpty().withMessage("Vui lòng nhập tên đăng nhập phòng/khoa"),
            check("username").isLength({min: 6, max: 18}).withMessage("Tên đăng nhập phải lớn hơn 6 và nhỏ hơn 18 ký tự"),
            check("username").not().matches("[^A-Za-z0-9]").withMessage("Tên đăng nhập không được chứa ký tự đặc biệt"),

            check("password").not().isEmpty().withMessage("Vui lòng nhập mật khẩu phòng/khoa"),
            check("password").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("password").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),

            check("passwordConfirm").not().isEmpty().withMessage("Vui lòng nhập mật khẩu phòng/khoa"),
            check("passwordConfirm").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("passwordConfirm").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            check("passwordConfirm").custom( (value, {req}) => {
                return value===req.body.password
              }).withMessage("Mật khẩu nhập lại không khớp"),

            
            check("id").not().isEmpty().withMessage("Không được để trống mã phòng"),
            check("id").isAscii().withMessage("Mã phòng không được chưa dấu"),
            check("id").not().matches("[^A-Za-z0-9]").withMessage("Mã phòng không chứa ký tự đặc biệt"),
    ] },
    
    insertNotification: () => {
        return [
            check("title").not().isEmpty().withMessage("Vui lòng nhập tựa đề thông báo"),

            check("subTitle").not().isEmpty().withMessage("Vui lòng nhập tựa đề nhỏ"),

            check("categoryId").not().isEmpty().withMessage("Vui lòng chọn Phòng/Khoa"),
            
            check("content").not().isEmpty().withMessage("Vui lòng nhập nội dung thông báo")
    ] },
    
    updateProfile: () => {
        return [
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên người dùng"),
            check("name").custom( (value, {req}) => {
                return alphaAndSpace(value)
              }).withMessage("Tên người dùng không được chứa ký tự đặc biệt"),
            
    ] },

    updatePassword: () => {
        return [
            check("oldPassword").not().isEmpty().withMessage("Vui lòng nhập mật khẩu cũ"),
            check("oldPassword").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("oldPassword").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            
            check("newPassword").not().isEmpty().withMessage("Vui lòng nhập mật khẩu mới"),
            check("newPassword").isLength({min: 6}).withMessage("Mật khẩu phải lớn hơn 6 ký tự"),
            check("newPassword").not().matches("[^A-Za-z0-9]").withMessage("Mật khẩu không được chứa ký tự đặc biệt"),
            
            check("reNewPassword").not().isEmpty().withMessage("Vui lòng nhập lại mật khẩu"),
            check("reNewPassword").custom((value, {req}) => {
                return value===req.body.newPassword
              }).withMessage("Mật khẩu nhập lại không khớp"),
        ]
    }

}