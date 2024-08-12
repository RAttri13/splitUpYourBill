import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function ContriApp() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFreind, setShowAddFreind] = useState(true);
  const [selectFriends, setSelectFriends] = useState(null);

  const handleAddFriends = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFreind(false);
  };
  function handleSelection(friend) {
    // setSelectFriends(friend);
    setSelectFriends((cur) => (cur?.id === friend.id ? null : friend));
  }

  const handleSplitBill = (value) => {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectFriends={selectFriends}
          onSelection={handleSelection}
        />

        {showAddFreind && <FormAddFriend onAddFriend={handleAddFriends} />}

        <Button onClick={() => setShowAddFreind(!showAddFreind)}>
          {showAddFreind ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectFriends && (
        <FormSplitBill
          selectFriends={selectFriends}
          onSplit={handleSplitBill}
          key={selectFriends.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectFriends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          selectFriends={selectFriends}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectFriends }) {
  const isSelected = selectFriends?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name}
          {friend.balance}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you
          {friend.balance}$
        </p>
      )}
      {friend.balance === 0 && (
        <p className="pink">you and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <form className="form-add-friend " onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
      {/* <Button>Close</Button> */}
    </form>
  );
}
function FormSplitBill({ selectFriends, onSplit }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    onSplit(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill " onSubmit={handleSubmit}>
      <h2>Split the bill with {selectFriends.name}</h2>

      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label> 🕴️your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑 {selectFriends.name} Expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriends.name}</option>
      </select>
      <Button>split bill</Button>
    </form>
  );
}
