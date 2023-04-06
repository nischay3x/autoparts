import connectDB from "../../../lib/mongo";
import Items from "../../../models/Items";

export default async function handler (req, res) {
    const { method, query, body } = req;
    await connectDB();
    
    if(!query.id) return res.status(405);
    
    switch(method) {
        case "PATCH": {
            try {
                let update = {...body};
                await Items.findByIdAndUpdate(query.id, { $set: update });
                res.status(200).json({msg: "Updated"});
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        }; break;
        
        case "DELETE": {
            try {
                await Items.findByIdAndDelete(query.id);
                console.log("Deleted")
                res.status(200).json({ msg: "Deleted"});
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        }; break;
        
        default: break;
    }
    
}