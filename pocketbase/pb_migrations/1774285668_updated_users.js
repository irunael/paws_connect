/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1736455494")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select1944576560",
    "maxSelect": 1,
    "name": "UserType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ngo",
      "adopter"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1736455494")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select1944576560",
    "maxSelect": 1,
    "name": "UserType",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "ngo",
      "adopter"
    ]
  }))

  return app.save(collection)
})
