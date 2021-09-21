const db = require("../models");
const User = db.User;
const Op = db.Sequelize.Op;
const nodemailer = require("../services/nodemailer.services.js");
var jsonData = require('../assets/i18n/pt.json');
const common = require('../../common.js');
const configs = common.configs();

const jwtAuth = require('../middleware/authJwt');

const config = require("../config/auth.config");
const Role = db.role;
const UserRole = db.UserRole;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

exports.register = async (req, res) => {
    const user = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 8),
        imageName: req.body.imageName,
        image: req.body.image,
        imageType: req.body.imageType,
        deleted: 0,
        emailConfirmed: 0,
        createdOn: db.Sequelize.fn('GETDATE'),
        createdBy: req.body.createdBy,
        updatedOn: db.Sequelize.fn('GETDATE'),
        updatedBy: req.body.updatedBy,
        version: 1
    }

    let [createdUser, created] = await User.findOrCreate({
        where: { email: user.email },
        defaults: user
    });

    if (created) {
        createdUser = createdUser.get({ plain: true });
        if (req.body.roles) {
            Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            });
        } else {
            const userRole = {
                userId: createdUser.Id,
                roleId: 2
            };
            UserRole.create(userRole).then(() => {
                res.send({ message: "User was registered successfully!" });
            });
        }

        var token = jwt.sign({ email: user.email }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        let to = createdUser.email;
        let subject = jsonData.REGISTER.EMAIL.SUBJECT;
        let url = `${configs.url}/account/confirmEmail`;
        let html = jsonData.REGISTER.EMAIL.HTML + `<a href="${url}?token=${token}">${url}</a></p>`;
        nodemailer.sendEmail(to, subject, null, html);
    }
    else {
        res.status(409).send({
            code: 'USER_EXISTS'
        });
    }
};

exports.login = async (req, res) => {

    const user = await User.findOne({
        where: {
            email: req.body.email,
            deleted: 0
        }
    });
    if (user === null) {
        return res.status(404).send({ code: "USER_NOT_FOUND" });
    }
    else {
        if (user.emailConfirmed == false) {
            return res.status(404).send({ code: "EMAIL_NOT_CONFIRMED" });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                code: 'INVALID_PASSWORD'
            });
        }

        const roles = await sequelize.query("SELECT description FROM Role INNER JOIN UserRole ON Role.Id = UserRole.RoleId where UserId = :userId",
            {
                replacements: { userId: user.id },
                type: QueryTypes.SELECT
            });

        var token = jwt.sign({ id: user.id, email: user.email }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            roles: roles,
            accessToken: token
        });
    }
};

exports.confirmEmail = async (req, res) => {
    jwtAuth.verifyEmailToken(req.body.token, 
        async function(email)
        {
            const user = await User.findOne({
                where: {
                    email: email,
                    deleted: 0
                }
            });

            if (user === null) {
                return res.status(404).send({ code: "USER_NOT_FOUND" });
            }
            else {
                await sequelize.query(
                    'UPDATE [User] SET emailConfirmed = :emailConfirmed WHERE id = :id',
                    {
                      replacements: { 
                        id: user.id,
                        emailConfirmed: true
                       },
                      type: QueryTypes.UPDATE
                    }
                  ).then(data => {
                    res.send(data);
                  })
                  .catch(err => {
                    res.status(500).send({
                      message:
                        err.message
                    });
                  });
            }
        }
    );
};