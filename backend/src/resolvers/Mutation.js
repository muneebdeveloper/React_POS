const Mutation = {
    user(parent, {id}, ctx, info){
        return ctx.db.query.user({where:{id}},info);
    }
}

module.exports = Mutation;