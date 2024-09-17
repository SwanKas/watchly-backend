
import mongoose from 'mongoose';

const ProvidersSchema = new mongoose.Schema({
    id_providers: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    url_providers: {
        type: String,
    },
    url_providers_img: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});      

const Providers = mongoose.model('Providers', ProvidersSchema);

export default Providers;
