import { X, Search } from "lucide-react";

const MembersModal = ({
  open,
  onClose,
  members,
  currentUser,
  admins,
  onMemberClick,
  searchQuery,
  setSearchQuery
}) => {

  if (!open) return null;

  return (

    <div
      className="
      fixed
      inset-0
      z-50
      bg-black/40
      flex
      items-center
      justify-center
      "
      onClick={onClose}
    >

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
w-full
max-w-xl
h-[650px]
bg-white
rounded-3xl
shadow-xl
overflow-hidden
flex
flex-col
"
      >

        <div
          className="
          flex
          items-center
          justify-between
          p-5
          border-b
          "
        >

          <h2
            className="
            font-bold
            text-lg
            "
          >
            Members
          </h2>

          <button
            onClick={onClose}
          >
            <X size={20}/>
          </button>

        </div>

        <div
  className="
  p-5
  flex-1
  flex
  flex-col
  "
>

          <div
            className="
            relative
            mb-5
            "
          >

            <Search
              size={16}
              className="
              absolute
              left-3
              top-3
              text-gray-400
              "
            />

            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search members"
              className="
              w-full
              pl-10
              pr-4
              py-3
              border
              rounded-xl
              "
            />

          </div>

         <div
  className="
  flex-1
  overflow-y-auto
  space-y-2
  "
>

            {members.map(
              member => {

                const isAdmin =
                  admins.some(
                    admin =>
                      String(
                        admin._id ||
                        admin
                      ) ===
                      String(
                        member._id
                      )
                  );

                return (

                  <button
                    key={member._id}
                    onClick={() =>
                      onMemberClick(
                        member
                      )
                    }
                    className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    hover:bg-gray-50
                    "
                  >

                    <div
                      className="
                      w-11
                      h-11
                      rounded-full
                      overflow-hidden
                      bg-gray-100
                      "
                    >

                      {member.profilePicture ? (

                        <img
                          src={
                            member.profilePicture
                          }
                          alt=""
                          className="
                          w-full
                          h-full
                          object-cover
                          "
                        />

                      ) : (

                        <div
                          className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          "
                        >
                          {member.name?.[0]}
                        </div>

                      )}

                    </div>

                    <div
                      className="
                      flex-1
                      text-left
                      "
                    >

                      <p
                        className="
                        font-medium
                        "
                      >
                        {
                          String(
                            member._id
                          ) ===
                          String(
                            currentUser?._id
                          )

                          ? `${member.name} (You)`

                          : member.name
                        }
                      </p>

                      {isAdmin && (

                        <span
                          className="
                          text-[10px]
                          bg-[#1E4631]/10
                          text-[#1E4631]
                          px-2
                          py-1
                          rounded-md
                          "
                        >
                          ADMIN
                        </span>

                      )}

                    </div>

                  </button>

                );

              }
            )}

          </div>

        </div>

      </div>

    </div>

  );

};

export default MembersModal;