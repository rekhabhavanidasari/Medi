import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  type PharmaStore = {
    name : Text;
    address : Text;
    phone : Text;
    hours : Text;
    lat : Float;
    lng : Float;
    distance : Float;
    area : Text;
    availableMeds : [Text];
    lowStockMeds : [Text];
    outOfStock : [Text];
    notes : Text;
  };

  let vacancies = Map.empty<Text, PharmaStore>();

  public shared ({ caller }) func addPharma(name : Text, address : Text, phone : Text, hours : Text, lat : Float, lng : Float, distance : Float, area : Text, availableMeds : [Text], lowStockMeds : [Text], outOfStock : [Text], notes : Text) : async () {
    if (vacancies.containsKey(name)) {
      Runtime.trap("Pharmacy with this name already exists");
    };
    let pharmaStore : PharmaStore = {
      name;
      address;
      phone;
      hours;
      lat;
      lng;
      distance;
      area;
      availableMeds;
      lowStockMeds;
      outOfStock;
      notes;
    };
    vacancies.add(name, pharmaStore);
  };

  public query ({ caller }) func getPharmas() : async [PharmaStore] {
    vacancies.values().toArray();
  };
};
