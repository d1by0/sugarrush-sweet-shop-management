const testUserController = (req, res) => {
    try{
        res.status(200).send({ //ok request
            success:true,
            message:'test User Data API',
        })
    }
    catch(error){
        console.log('Error in Test API', error) //shows error if api got failed
    }
}

module.exports = { testUserController };