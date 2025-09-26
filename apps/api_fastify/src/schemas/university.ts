import { Type, Static } from "@sinclair/typebox";

const NullableString = Type.Union([Type.String(), Type.Null()]);
const NullableNumber = Type.Union([Type.Number(), Type.Null()]);

export const UniversityResponse = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  abbreviation: NullableString,
  latitude: NullableNumber,
  longitude: NullableNumber,
});

export const UniversityListResponse = Type.Array(UniversityResponse);

export type UniversityResponseType = Static<typeof UniversityResponse>;
export type UniversityListResponseType = Static<typeof UniversityListResponse>;
