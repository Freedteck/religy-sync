import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";

export const useQueryEvents = ({
  packageId,
  eventType,
  filters = {},
  queryOptions = {},
}) => {
  const { contentType, relatedTo, sender } = filters;

  return useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${packageId}::religy_sync::${eventType}`,
      },
      cursor: null,
    },
    {
      ...queryOptions,
      select: (data) => {
        let events = data.pages.flatMap((page) => page.data);

        if (contentType !== undefined) {
          events = events.filter(
            (x) => x.parsedJson.content_type === contentType
          );
        }

        if (relatedTo) {
          events = events.filter((x) => x.parsedJson.related_to === relatedTo);
        }

        if (sender) {
          events = events.filter((x) => x.sender === sender);
        }

        return events;
      },
    }
  );
};
