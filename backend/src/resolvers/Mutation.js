const Mutation = {
    changename(parent,args,ctx,info){
        return `Name ${args.name} was changed`;
    }
}

module.exports = Mutation;