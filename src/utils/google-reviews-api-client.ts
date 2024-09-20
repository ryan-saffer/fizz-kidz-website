import { PlacesClient } from "@googlemaps/places";
import { mybusinessbusinessinformation_v1 } from "@googleapis/mybusinessbusinessinformation";
import { google } from "googleapis";

export class GoogleReviewsApiClient {
  placesClient: PlacesClient = new PlacesClient({
    apiKey: "AIzaSyASSMvVe-CXBGUQcp_gNHwqG-VhLglicyU",
  });

  businessInfoClient;

  constructor() {
    const auth = new google.auth.OAuth2({
      // TODO - follow steps here to get client id and token etc https://developers.google.com/my-business/content/basic-setup#make-simple-http-request
      // currently waiting to get access to business api (currently it says quota is 0, which means we have no been approved).
    });
    this.businessInfoClient =
      new mybusinessbusinessinformation_v1.Resource$Locations({
        _options: { auth },
      });
  }

  async getReviewsV2() {
    console.log("getting reviews");
    const result = await this.businessInfoClient.get({
      name: "locations/ChIJ92NJJx5q1moRdDSJo_X3BRo",
      key: "AIzaSyASSMvVe-CXBGUQcp_gNHwqG-VhLglicyU",
    });

    return result;
  }

  async getReviews() {
    console.log("getting reviews");
    const result = await this.placesClient.getPlace(
      {
        name: `places/ChIJ92NJJx5q1moRdDSJo_X3BRo`,
      },
      {
        otherArgs: {
          headers: {
            "X-Goog-FieldMask": "reviews",
          },
        },
      },
    );

    return result;
  }
}
