/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c3u6o7gfll2y3ex")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_u82ZXvq` ON `associations` (`subdomain`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("c3u6o7gfll2y3ex")

  collection.indexes = []

  return dao.saveCollection(collection)
})
