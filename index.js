import  {MongoClient} from "mongodb" ;

import express from "express"
import cors from "cors"

const app = express()
const port = 3000
app.use(express.json())
app.use(cors())



async function inscription(nom,prenom,login,mdp) {

    const uri =
    "mongodb+srv://hakimallouchene:psNVlTpzOIrbpDWv@cluster0.6rmoizf.mongodb.net/";
    
    const client = new MongoClient(uri);

    await client.connect();
    
    const dbName = "myDatabase";
    const collectionName = "users";
    
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    
    const recipes = [
        {
            nom: nom,
            prenom: prenom,
            login: login,
            mdp: mdp
        },
        
    ];
    
    try {
        const insertManyResult = await collection.insertMany(recipes);
        console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
    } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }
    
    
    // Make sure to call close() on your client to perform cleanup operations
    await client.close();
}

async function connexion(user={}){
    const uri =
    "mongodb+srv://hakimallouchene:psNVlTpzOIrbpDWv@cluster0.6rmoizf.mongodb.net/";


    
    const client = new MongoClient(uri);

    await client.connect();
    
    const dbName = "myDatabase";
    const collectionName = "users";
    
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const r = await collection.find(user).toArray()

    return r
}

app.post('/inscription',(req,res)=>{
    const nom=req.body.nom
    const prenom=req.body.prenom
    const login=req.body.login
    const mdp=req.body.mdp
    const confirmation=req.body.confirmation

    if(mdp == confirmation && nom.length>0 && prenom.length>0 && mdp.length>0 && login.length>0){

        inscription(nom,prenom,login,mdp).catch(console.dir);

    }else{
        console.log('erreur veuillez vérifier les données saisies');
    }
})


app.post('/connexion',async(req,res)=>{
    const user=req.body
    const a =await connexion(user)
    if(a.length>0){
        res.status(200).json()
        console.log('bien connecté')
    }else{
        res.status(500).json()
        console.log('Utilisateur introuvable');
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })