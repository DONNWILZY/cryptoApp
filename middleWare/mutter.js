const uploadPhoto = (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
      if (err) {
        // Handle error, like sending an error response
        return next(err);
      }
  
      // Access uploaded file information in req.file
      const photoUrl = req.file.firebaseUrl; // Firebase storage URL
  
      // Continue processing and pass photo URL to next middleware
      req.photoUrl = photoUrl;
      next();
    });
  };
  