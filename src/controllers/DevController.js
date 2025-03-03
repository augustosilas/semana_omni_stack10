const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

// index: mostrar uma lista do recurso
// show: mostrar um único elemento
// store: criar
// update: alterar
// destroy: deletar

module.exports = {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store (request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        
        let dev = await Dev.findOne({ github_username });

        if (!dev) {
            apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const {name = login, avatar_url, bio} = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            const dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }

        return response.json(dev);
    },

    async update(request, response) {
        const dev = await Dev.findByIdAndUpdate(request.params.id, request.body, {new: true});

        return response.json(dev);
    },

    async destroy(request, response) {
        await Dev.findByIdAndRemove(request.params.id);

        return response.send();
    }
}