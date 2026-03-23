/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4198160791",
        "max": 0,
        "min": 0,
        "name": "petName",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select684191928",
        "maxSelect": 1,
        "name": "petType",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "dog",
          "cat",
          "rabbit",
          "bird",
          "other"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4172253263",
        "max": 0,
        "min": 0,
        "name": "breed",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number2704281778",
        "max": null,
        "min": null,
        "name": "age",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "select2908202876",
        "maxSelect": 1,
        "name": "healthStatus",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "healthy",
          "sick",
          "recovering"
        ]
      },
      {
        "hidden": false,
        "id": "bool4155007451",
        "name": "vaccinationStatus",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3658418890",
        "max": 0,
        "min": 0,
        "name": "vacines",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4150396487",
        "max": 0,
        "min": 0,
        "name": "diseases",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1843675174",
        "max": 0,
        "min": 0,
        "name": "description",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file2468036205",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "petPhoto",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1736455494",
        "hidden": false,
        "id": "relation1849568411",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "ngoId",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_2704641423",
    "indexes": [],
    "listRule": null,
    "name": "pets",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2704641423");

  return app.delete(collection);
})
