exports.getRequests = (req, res, next) => {
    res.status(200).json({success: true, message:"Get all requests"})
}

exports.getRequest = (req, res, next) => {
    res.status(200).json({success: true, message:`Get request ${req.params.id}`})
}

exports.createRequest = (req, res, next) => {
    res.status(200).json({success: true, message:"Create new request"})
}

exports.updateRequest = (req, res, next) => {
    res.status(200).json({success: true, message:`Update request ${req.params.id}`})
}

exports.deleteRequest = (req, res, next) => {
    res.status(200).json({success: true, message:`Delete request ${req.params.id}`})
}