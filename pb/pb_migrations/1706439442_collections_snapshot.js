/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    const snapshot = [
      {
        id: "_pb_users_auth_",
        created: "2024-01-22 08:42:35.623Z",
        updated: "2024-01-28 10:55:13.182Z",
        name: "maintainers",
        type: "auth",
        system: false,
        schema: [
          {
            system: false,
            id: "users_name",
            name: "name",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "users_avatar",
            name: "avatar",
            type: "file",
            required: false,
            presentable: false,
            unique: false,
            options: {
              mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
              thumbs: null,
              maxSelect: 1,
              maxSize: 5242880,
              protected: false
            }
          },
          {
            system: false,
            id: "4ccpazlb",
            name: "associations",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "c3u6o7gfll2y3ex",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: null,
              displayFields: null
            }
          }
        ],
        indexes: [],
        listRule: null,
        viewRule: "",
        createRule: "",
        updateRule: "id = @request.auth.id",
        deleteRule: "id = @request.auth.id",
        options: {
          allowEmailAuth: true,
          allowOAuth2Auth: true,
          allowUsernameAuth: true,
          exceptEmailDomains: null,
          manageRule: null,
          minPasswordLength: 8,
          onlyEmailDomains: null,
          onlyVerified: false,
          requireEmail: false
        }
      },
      {
        id: "c3u6o7gfll2y3ex",
        created: "2024-01-28 08:26:21.619Z",
        updated: "2024-01-28 10:43:14.394Z",
        name: "associations",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "h2p0ibqm",
            name: "name",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "a9l1eimz",
            name: "subdomain",
            type: "text",
            required: true,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          }
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: '@request.auth.id != ""',
        updateRule: "@collection.associations.id = @request.auth.associations.id",
        deleteRule: "@collection.associations.id = @request.auth.associations.id",
        options: {}
      },
      {
        id: "39ky58mkmfzpfth",
        created: "2024-01-28 08:27:05.703Z",
        updated: "2024-01-28 10:44:15.345Z",
        name: "locations",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "gg7y81kn",
            name: "name",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "zdbsnabm",
            name: "location",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "6dwyfmx4",
            name: "association",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "c3u6o7gfll2y3ex",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          }
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: '@request.auth.id != ""',
        updateRule: "@request.auth.associations.id = association.id",
        deleteRule: "@request.auth.associations.id = association.id",
        options: {}
      },
      {
        id: "z8xe3xpin16ml5b",
        created: "2024-01-28 08:30:41.623Z",
        updated: "2024-01-28 10:44:21.960Z",
        name: "events",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "0q3jxjv9",
            name: "datetime",
            type: "date",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: "",
              max: ""
            }
          },
          {
            system: false,
            id: "lj2g6kaq",
            name: "title",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "f3yfyl2v",
            name: "body",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "pd3s5s6p",
            name: "location",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "39ky58mkmfzpfth",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          },
          {
            system: false,
            id: "851phunx",
            name: "type",
            type: "select",
            required: false,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              values: ["meetup", "dig_day"]
            }
          },
          {
            system: false,
            id: "rzxs8uie",
            name: "association",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "c3u6o7gfll2y3ex",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          },
          {
            system: false,
            id: "anu2xbrg",
            name: "author",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "_pb_users_auth_",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          }
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: '@request.auth.id != ""',
        updateRule: "@request.auth.associations.id = association.id",
        deleteRule: "@request.auth.associations.id = association.id",
        options: {}
      },
      {
        id: "u9t0ai68ljo12a2",
        created: "2024-01-28 08:31:04.369Z",
        updated: "2024-01-28 10:45:10.235Z",
        name: "supporters",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "ql9c5yly",
            name: "email",
            type: "email",
            required: false,
            presentable: false,
            unique: false,
            options: {
              exceptDomains: null,
              onlyDomains: null
            }
          },
          {
            system: false,
            id: "0bdudhva",
            name: "association",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "c3u6o7gfll2y3ex",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: null,
              displayFields: null
            }
          }
        ],
        indexes: [],
        listRule: null,
        viewRule: null,
        createRule: "",
        updateRule: null,
        deleteRule: null,
        options: {}
      },
      {
        id: "se4ykvs9eytxi2r",
        created: "2024-01-28 08:33:19.542Z",
        updated: "2024-01-28 10:46:50.333Z",
        name: "trails",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "cskeosel",
            name: "name",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "2cygfpij",
            name: "grade",
            type: "select",
            required: false,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              values: ["green", "blue", "red", "black"]
            }
          },
          {
            system: false,
            id: "ih6pkfhg",
            name: "length",
            type: "number",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              noDecimal: false
            }
          },
          {
            system: false,
            id: "gstwlayx",
            name: "description",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "va6lesvv",
            name: "location",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "39ky58mkmfzpfth",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          }
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: '@request.auth.id != ""',
        updateRule: "@request.auth.associations.id = location.association.id",
        deleteRule: "@request.auth.associations.id = location.association.id",
        options: {}
      },
      {
        id: "8u027d64vng9l7d",
        created: "2024-01-28 08:35:24.175Z",
        updated: "2024-01-28 10:42:28.392Z",
        name: "features",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "xc0wg7ha",
            name: "type",
            type: "select",
            required: false,
            presentable: false,
            unique: false,
            options: {
              maxSelect: 1,
              values: [
                "berm",
                "drop",
                "gap_jump",
                "table_top",
                "double",
                "rock_garden",
                "roots",
                "rut",
                "step_up",
                "step_down"
              ]
            }
          },
          {
            system: false,
            id: "z6ptoyqp",
            name: "description",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          }
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: '@request.auth.id != ""',
        updateRule: null,
        deleteRule: null,
        options: {}
      },
      {
        id: "oak7k0c0fdtozn8",
        created: "2024-01-28 08:35:52.990Z",
        updated: "2024-01-28 10:44:42.679Z",
        name: "posts",
        type: "base",
        system: false,
        schema: [
          {
            system: false,
            id: "jg0vfvgw",
            name: "title",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "vznozflg",
            name: "body",
            type: "text",
            required: false,
            presentable: false,
            unique: false,
            options: {
              min: null,
              max: null,
              pattern: ""
            }
          },
          {
            system: false,
            id: "reik6kbn",
            name: "association",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "c3u6o7gfll2y3ex",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          },
          {
            system: false,
            id: "etb2at5q",
            name: "author",
            type: "relation",
            required: false,
            presentable: false,
            unique: false,
            options: {
              collectionId: "_pb_users_auth_",
              cascadeDelete: false,
              minSelect: null,
              maxSelect: 1,
              displayFields: null
            }
          }
        ],
        indexes: [],
        listRule: "",
        viewRule: "",
        createRule: '@request.auth.id != ""',
        updateRule: "@request.auth.associations.id = association.id",
        deleteRule: "@request.auth.associations.id = association.id",
        options: {}
      }
    ];

    const collections = snapshot.map((item) => new Collection(item));

    return Dao(db).importCollections(collections, true, null);
  },
  (db) => {
    return null;
  }
);
