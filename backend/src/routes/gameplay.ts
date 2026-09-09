import { Router } from "express";
import { advanceOrigin,buyListing,createListing,createOrganization,depositTreasury,getOrigins,joinOrganization,listMarketplace,listOrganizations,rest,spendStatPoint,trainMastery,travel,listShopItems,buyShopItem,devGrant,chooseFaction } from "../services/gameplayService.js";
import { ValidationError } from "../services/characterService.js";
export const gameplayRouter=Router();
const run=(res:any,fn:()=>unknown)=>{try{res.json(fn())}catch(e){if(e instanceof ValidationError)res.status(400).json({error:e.message});else throw e}};
gameplayRouter.get("/origins",(req,res)=>res.json(getOrigins(req.query.worldId as string|undefined)));
gameplayRouter.post("/characters/:id/origin/advance",(req,res)=>run(res,()=>advanceOrigin(req.params.id)));
gameplayRouter.post("/characters/:id/stats/spend",(req,res)=>run(res,()=>spendStatPoint(req.params.id,req.body.stat)));
gameplayRouter.post("/characters/:id/mastery/train",(req,res)=>run(res,()=>trainMastery(req.params.id,req.body.abilityId)));
gameplayRouter.post("/characters/:id/rest",(req,res)=>run(res,()=>rest(req.params.id)));
gameplayRouter.post("/characters/:id/travel",(req,res)=>run(res,()=>travel(req.params.id,req.body.toLocationId)));
gameplayRouter.get("/marketplace",(_req,res)=>res.json(listMarketplace()));
gameplayRouter.post("/marketplace",(req,res)=>run(res,()=>createListing(req.body.characterId,req.body.itemId,Number(req.body.quantity),Number(req.body.pricePerItem))));
gameplayRouter.post("/marketplace/:id/buy",(req,res)=>run(res,()=>buyListing(req.body.characterId,req.params.id)));
gameplayRouter.get("/organizations",(req,res)=>res.json(listOrganizations(req.query.worldId as string|undefined)));
gameplayRouter.post("/organizations",(req,res)=>run(res,()=>createOrganization(req.body.characterId,req.body.name,req.body.type)));
gameplayRouter.post("/organizations/:id/join",(req,res)=>run(res,()=>joinOrganization(req.body.characterId,req.params.id)));
gameplayRouter.post("/organizations/:id/treasury/deposit",(req,res)=>run(res,()=>depositTreasury(req.body.characterId,req.params.id,Number(req.body.amount))));

gameplayRouter.get("/shop",(_req,res)=>res.json(listShopItems()));
gameplayRouter.post("/shop/buy",(req,res)=>run(res,()=>buyShopItem(req.body.characterId,req.body.itemId,Number(req.body.quantity??1))));
gameplayRouter.post("/dev/characters/:id/grant",(req,res)=>{if(process.env.NODE_ENV==="production")return res.status(404).json({error:"DEV_DISABLED"});return run(res,()=>devGrant(req.params.id,req.body));});

gameplayRouter.post("/characters/:id/faction",(req,res)=>run(res,()=>chooseFaction(req.params.id,req.body.factionId)));
