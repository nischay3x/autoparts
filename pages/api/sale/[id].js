import connectDB from "../../../lib/mongo";
import Items from "../../../models/Items";
import Sales from "../../../models/Sales";

export default async function handler (req, res) {
    const { method, query, body } = req;
    await connectDB();
    
    if(!query.id) return res.status(405);
    
    switch(method) {
        case "GET" : {
            try {
                const sale = await Sales.findById(query.id);
                return res.status(200).json(sale);
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }; break;
        }
        case "PATCH": {
            try {
                let update = {...body};
                await Sales.findByIdAndUpdate(query.id, { $set: update });
                res.status(200).json({id: query.id});
            } catch (error) {
                console.log(error);
                res.status(500).send(error);
            }
        }; break;
        
        default: break;
    }
    
}