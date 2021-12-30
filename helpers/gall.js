const Gall = async (action, details, ctx) => {
  const history = ctx.db.collection('history');
  
  if (Array.isArray(details)) {
    await history.insertMany(details.map((item) => {
      return {
        _store: ctx.store,
        _action: action,
        details: item.details
      }
    }));
  } else {
    await history.insertOne({ 
      _store: ctx.store,
      _action: action,
      details: details
    });
  }

  const count = await history.countDocuments(
    { _store: ctx.store }
  );

  if (count > 100) {
    let oldest = await history.find(
      { _store: ctx.store },
      { limit: count - 100, sort: { _id: 1 } }
    ).toArray();

    let _ids = [];
    oldest.forEach(function(el) {
      if (_ids.indexOf(el._id) == -1) {
        _ids.push(el._id);
      }
    });

    if (_ids.length) {
      await history.deleteMany(
        { _id: { $in: _ids } }
      );
    }
  }
};

export default Gall;