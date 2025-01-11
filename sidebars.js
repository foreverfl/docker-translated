module.exports = {
  sidebars: {
    "getStarted": [
      {
        "type": "category",
        "label": "docker-concepts",
        "items": [
          {
            "type": "category",
            "label": "building-images",
            "items": [
              "get-started/docker-concepts/building-images/build-tag-and-publish-an-image",
              {
                "type": "category",
                "label": "images",
                "items": []
              },
              "get-started/docker-concepts/building-images/multi-stage-builds",
              "get-started/docker-concepts/building-images/understanding-image-layers",
              "get-started/docker-concepts/building-images/using-the-build-cache",
              "get-started/docker-concepts/building-images/writing-a-dockerfile",
              "get-started/docker-concepts/building-images/_index"
            ]
          },
          {
            "type": "category",
            "label": "running-containers",
            "items": [
              {
                "type": "category",
                "label": "images",
                "items": []
              },
              "get-started/docker-concepts/running-containers/multi-container-applications",
              "get-started/docker-concepts/running-containers/overriding-container-defaults",
              "get-started/docker-concepts/running-containers/persisting-container-data",
              "get-started/docker-concepts/running-containers/publishing-ports",
              "get-started/docker-concepts/running-containers/sharing-local-files",
              "get-started/docker-concepts/running-containers/_index"
            ]
          },
          {
            "type": "category",
            "label": "the-basics",
            "items": [
              {
                "type": "category",
                "label": "images",
                "items": []
              },
              "get-started/docker-concepts/the-basics/what-is-a-container",
              "get-started/docker-concepts/the-basics/what-is-a-registry",
              "get-started/docker-concepts/the-basics/what-is-an-image",
              "get-started/docker-concepts/the-basics/what-is-docker-compose",
              "get-started/docker-concepts/the-basics/_index"
            ]
          },
          "get-started/docker-concepts/_index"
        ]
      },
      "get-started/docker-overview",
      "get-started/get-docker",
      {
        "type": "category",
        "label": "images",
        "items": []
      },
      {
        "type": "category",
        "label": "introduction",
        "items": [
          "get-started/introduction/build-and-push-first-image",
          "get-started/introduction/develop-with-containers",
          "get-started/introduction/get-docker-desktop",
          {
            "type": "category",
            "label": "images",
            "items": []
          },
          "get-started/introduction/whats-next",
          "get-started/introduction/_index"
        ]
      },
      "get-started/resources",
      {
        "type": "category",
        "label": "workshop",
        "items": [
          "get-started/workshop/02_our_app",
          "get-started/workshop/03_updating_app",
          "get-started/workshop/04_sharing_app",
          "get-started/workshop/05_persisting_data",
          "get-started/workshop/06_bind_mounts",
          "get-started/workshop/07_multi_container",
          "get-started/workshop/08_using_compose",
          "get-started/workshop/09_image_best",
          "get-started/workshop/10_what_next",
          {
            "type": "category",
            "label": "images",
            "items": []
          },
          "get-started/workshop/_index"
        ]
      },
      "get-started/_index"
    ],
    "manual": [
      "manual/intro"
    ],
    "reference": [
      "reference/intro"
    ]
  }
};
