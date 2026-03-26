import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

actor {
  // ─── TYPES ───

  type Inquiry = {
    name : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type Property = {
    id : Nat;
    title : Text;
    description : Text;
    price : Text;
    location : Text;
    propertyType : Text;
    imageUrl : Text;
    createdAt : Time.Time;
  };

  // ─── AUTHORIZATION ───

  var admin : ?Principal = null;

  func isAuthorized(caller : Principal) : Bool {
    switch (admin) {
      case (?a) { caller == a };
      case (null) { false };
    };
  };

  public shared ({ caller }) func configure() : async () {
    switch (admin) {
      case (null) { admin := ?caller };
      case (?_) { Runtime.trap("Already configured") };
    };
  };

  // ─── INQUIRIES ───

  module InquiryOrd {
    public func compareByTimestamp(a : Inquiry, b : Inquiry) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  let inquiries = Map.empty<Principal, Inquiry>();

  public shared ({ caller }) func submitInquiry(name : Text, phone : Text, message : Text) : async () {
    let inquiry : Inquiry = {
      name;
      phone;
      message;
      timestamp = Time.now();
    };
    inquiries.add(caller, inquiry);
  };

  public shared ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not isAuthorized(caller)) { Runtime.trap("Unauthorized") };
    inquiries.values().toArray().sort(InquiryOrd.compareByTimestamp);
  };

  // ─── PROPERTIES ───

  var nextPropertyId : Nat = 0;
  let properties = Map.empty<Nat, Property>();

  public shared ({ caller }) func addProperty(
    title : Text,
    description : Text,
    price : Text,
    location : Text,
    propertyType : Text,
    imageUrl : Text
  ) : async Nat {
    if (not isAuthorized(caller)) { Runtime.trap("Unauthorized") };
    let id = nextPropertyId;
    nextPropertyId += 1;
    let property : Property = {
      id;
      title;
      description;
      price;
      location;
      propertyType;
      imageUrl;
      createdAt = Time.now();
    };
    properties.add(id, property);
    id;
  };

  public shared ({ caller }) func removeProperty(id : Nat) : async () {
    if (not isAuthorized(caller)) { Runtime.trap("Unauthorized") };
    properties.remove(id);
  };

  public query func getAllProperties() : async [Property] {
    properties.values().toArray();
  };

  public query func getProperty(id : Nat) : async ?Property {
    properties.get(id);
  };
};
