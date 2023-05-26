const router = require('../routes/users')
const userModel = require('../models/users')


const createNewUser = (req, res) => {
    res.json({
        message: 'CREATE new user success',
        datas: req.body
    })
}

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await userModel.getAllUsers();
        res.json({
            message: 'GET all users success',
            datas: rows
        })
    } catch (error) {
        res.status(500).json({
            message: 'server error',
            serverMessage: error,
        })
    }
}

const selectUser = (req, res) => {
    const { idUser } = req.params;
    res.json({
        message: 'SELECT user success',
        datas: {
            id: idUser,
            name: "name",
            email: "email"
        }
    })
}


module.exports = {
    getAllUsers,
    createNewUser,
    selectUser,
}