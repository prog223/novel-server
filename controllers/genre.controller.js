import Genre from '../models/genre.model.js';

export const getGenres = async (req, res, next) => {
	try {
		const genres = await Genre.find();

		res.status(200).send({ success: true, data: genres });
	} catch (err) {
		next(err);
	}
};

export const createGenre = async (req, res, next) => {
	try {
		const genre = await new Genre(req.body).save();

		res.status(200).send({
			success: true,
			data: genre,
			message: 'Genre suceessfully created',
		});
	} catch (err) {
		next(err);
	}
};

export const deleteGenre = async(req, res, next) =>{
   try{
      await Genre.findByIdAndDelete(req.params.id)

      res.status(200).send({success: true, message: 'Genre has been successfully deleted'})
   }catch(err){
      next(err)
   }
}