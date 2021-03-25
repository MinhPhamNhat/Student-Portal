const { check } = require("express-validator")

module.exports = {
    loginValidator: (req, res, next) => {

    },
    
    insertDepartmentValidator: () => {
        return [
            check("name").not().isEmpty().withMessage("Vui lòng nhập tên phòng/khoa"),
            check("name").not().isAlpha().withMessage("Tên phòng/khoa không được chứa số hoặc ký tự đặc biệt"),

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
    ]
        
    },
    

}