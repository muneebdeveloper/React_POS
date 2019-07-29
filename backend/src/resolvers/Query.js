const Query = {
    user(parent, args, ctx, info){
        return ctx.db.query.user({where:{id:"cjyo9s84hbhmd0b531ututeih"}},info);
    }
}

module.exports = Query;