import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  getStarted: [
    {
      type: "doc",
      id: "get-started/get-docker",
      label: "Docker 설치하기",
    },
    {
      type: "doc",
      id: "get-started/docker-overview",
      label: "Docker 개요",
    },
    {
      type: "category",
      label: "시작하기",
      items: [
        "get-started/introduction/build-and-push-first-image",
        "get-started/introduction/develop-with-containers",
        "get-started/introduction/get-docker-desktop",
        "get-started/introduction/whats-next",
      ],
    },
    {
      type: "category",
      label: "Docker 개념",
      items: [
        {
          type: "category",
          label: "기초 개념",
          items: [
            "get-started/docker-concepts/the-basics/what-is-a-container",
            "get-started/docker-concepts/the-basics/what-is-a-registry",
            "get-started/docker-concepts/the-basics/what-is-an-image",
            "get-started/docker-concepts/the-basics/what-is-docker-compose",
          ],
        },
        {
          type: "category",
          label: "이미지 빌드하기",
          items: [
            "get-started/docker-concepts/building-images/build-tag-and-publish-an-image",
            "get-started/docker-concepts/building-images/multi-stage-builds",
            "get-started/docker-concepts/building-images/understanding-image-layers",
            "get-started/docker-concepts/building-images/using-the-build-cache",
            "get-started/docker-concepts/building-images/writing-a-dockerfile",
          ],
        },
        {
          type: "category",
          label: "컨테이너 실행하기",
          items: [
            "get-started/docker-concepts/running-containers/multi-container-applications",
            "get-started/docker-concepts/running-containers/overriding-container-defaults",
            "get-started/docker-concepts/running-containers/persisting-container-data",
            "get-started/docker-concepts/running-containers/publishing-ports",
            "get-started/docker-concepts/running-containers/sharing-local-files",
          ],
        },
      ],
    },
    {
      type: "doc",
      id: "get-started/resources",
      label: "리소스",
    },
    {
      type: "category",
      label: "실습",
      items: [
        "get-started/workshop/our_app",
        "get-started/workshop/updating_app",
        "get-started/workshop/sharing_app",
        "get-started/workshop/persisting_data",
        "get-started/workshop/bind_mounts",
        "get-started/workshop/multi_container",
        "get-started/workshop/using_compose",
        "get-started/workshop/image_best",
        "get-started/workshop/what_next",
      ],
    },
  ],
  manual: ["manual/intro"],
  reference: ["reference/intro"],
};

export default sidebars;
