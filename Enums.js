/** This file lists all of the enums which should available for the WDC */
var allEnums = {
  phaseEnum : {
    interactivePhase: "interactive",
    authPhase: "auth",
    gatherDataPhase: "gatherData"
  },

  authPurposeEnum : {
    ephemeral: "ephemeral",
    enduring: "enduring"
  },

  authTypeEnum : {
    none: "none",
    basic: "basic",
    custom: "custom"
  },

  dataTypeEnum : {
    bool: "bool",
    date: "date",
    datetime: "datetime",
    float: "float",
    int: "int",
    string: "string"
  },

  columnRoleEnum : {
      dimension: "dimension",
      measure: "measure"
  },

  columnTypeEnum : {
      continuous: "continuous",
      discrete: "discrete"
  },

  aggTypeEnum : {
      sum: "sum",
      avg: "avg",
      median: "median",
      count: "count",
      countd: "count_dist"
  },

  geographicRoleEnum : {
      area_code: "area_code",
      cbsa_msa: "cbsa_msa",
      city: "city",
      congressional_district: "congressional_district",
      country_region: "country_region",
      county: "county",
      state_province: "state_province",
      zip_code_postcode: "zip_code_postcode",
      latitude: "latitude",
      longitude: "longitude"
  },

  unitsFormatEnum : {
      thousands: "thousands",
      millions: "millions",
      billions_english: "billions_english",
      billions_standard: "billions_standard"
  },

  numberFormatEnum : {
      number: "number",
      currency: "currency",
      scientific: "scientific",
      percentage: "percentage"
  },

  localeEnum : {
      america: "en-us",
      brazil:  "pt-br",
      china:   "zh-cn",
      france:  "fr-fr",
      germany: "de-de",
      japan:   "ja-jp",
      korea:   "ko-kr",
      spain:   "es-es"
  },

  joinEnum : {
      inner: "inner",
      left: "left"
  }
}

// Applies the enums as properties of the target object
function apply(target) {
  for(var key in allEnums) {
    target[key] = allEnums[key];
  }
}

module.exports.apply = apply;
