import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-skeleton-loader";
import { AnimationWrapper } from "react-hover-animation";
import { ThreeDots } from "react-loader-spinner";

const API_KEY = import.meta.env.VITE_SPLASH_API_KEY;

const SkeletonLoader = () => {
  return (
    <DragableDiv
      style={{
        height: "350px",
        margin: "1px",
        border: "none",
      }}
    >
      <Skeleton width="180px" height="350px" />
    </DragableDiv>
  );
};

const Grid = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const isAuthenticated = !!localStorage.getItem("userId");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?count=30&client_id=${API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          const slicedData = data.slice(0, 10).map((item, index) => ({
            id: `item-${index}`,
            imageUrl: item.urls.regular,
            description: item.description
              ? item.description.split(" ").slice(0, 2).join(" ")
              : "No description available",
          }));
          setItems(slicedData);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("error fetching picture");
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const fetchImages = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=30&query=${query}&client_id=${API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        const slicedData = data.slice(0, 10).map((item, index) => ({
          id: `item-${index}`,
          imageUrl: item.urls.regular,
          description: item.description
            ? item.description.split(" ").slice(0, 2).join(" ")
            : "No description available",
        }));
        setItems(slicedData);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("error fetching picture");
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <div>
      {isAuthenticated && (
        <>
          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      )}
      <Header handleSearchInputChange={handleSearchInputChange} />
      <div>
        {!isAuthenticated && (
          <>
            <p>
              Please{" "}
              <span>
                <Link to="/login">login</Link>
              </span>{" "}
              to enjoy drag and drop features
            </p>
          </>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd} isDragDisabled={!isAuthenticated}>
        <GridContainer>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SkeletonLoader key={`skeleton-${index}`} />
              ))
            : items.map((item, index) => (
                <Droppable
                  key={item.id}
                  droppableId={item.id}
                  direction="horizontal"
                  type="group"
                >
                  {(provided) => (
                    <GridItemContainer
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={!isAuthenticated}
                      >
                        {(provided) => (
                          <>
                            <DragableDiv
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                cursor: "pointer",
                                // backgroundImage: `url(${item.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <AnimationWrapper>
                                <img src={item.imageUrl} />
                              </AnimationWrapper>
                              <p>{item.description}</p>
                            </DragableDiv>
                          </>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </GridItemContainer>
                  )}
                </Droppable>
              ))}
        </GridContainer>
      </DragDropContext>
    </div>
  );
};

export default Grid;

// Header.js

const Header = ({ handleSearchInputChange }) => {
  const isAuthenticated = !!localStorage.getItem("userId");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem("userId");
      setIsLoading(false);
      navigate("/login");
    }, 4000);
  };
  return (
    <HeaderContainer>
      <Logo>
        <img
          src="https://media.istockphoto.com/id/1286477689/fr/vectoriel/ic%C3%B4ne-glisser-et-d%C3%A9poser-curseur-pointeur-souris-dordinateur-ic%C3%B4ne-de-ligne-de-tra%C3%AEn%C3%A9e.jpg?s=612x612&w=0&k=20&c=COiZpk33aWjO-0oCTutgKPsEjjEAuA7Y4YV2fpSa7RI="
          alt="Logo"
          width="500px"
          height="50px"
        />
      </Logo>
      <SearchContainer>
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearchInputChange}
        />
      </SearchContainer>
      {isAuthenticated ? (
        <LogoutButton onClick={onLogout}>
          {isLoading ? (
            <ThreeDots
              height="10"
              width="40"
              radius="9"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          ) : (
            "Logout"
          )}
        </LogoutButton>
      ) : (
        <Link to="/login">
          <LoginButton>Login</LoginButton>
        </Link>
      )}
    </HeaderContainer>
  );
};

const LogoutButton = styled.button`
  padding: 5px 20px;
  background-color: red;
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
`;

const LoginButton = styled.button`
  padding: 5px 20px;
  background-color: white;
  border: 2px solid #333;
  border-radius: 20px;
  color: #333;
  cursor: pointer;
`;

const GridContainer = styled.div`
  display: grid;
  padding: 10px;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  width: 90%;
  margin: auto;
  place-items: center;
`;

const GridItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeaderContainer = styled.header`
  width: auto;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #333;

  @media (max-width: 728px) {
    padding: 2px;
  }
`;

const Logo = styled.div`
  img {
    width: 50px;
    max-height: 50px;
  }
`;

const DragableDiv = styled.div`
  width: 170px;
  height: auto;
  border: 2px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 10px;
  border-radius: 20px;
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  img {
    width: 95%;
    height: 300px;
    border-radius: 10px;
  }

  p {
    color: white;
    font-size: 14px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;

  input[type="text"] {
    width: 200px;
    padding: 5px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;

    @media (max-width: 728px) {
      width: 170px;
    }
  }

  button {
    padding: 5px 10px;
    background-color: #fff; /* Set your button background color */
    border: none;
    border-radius: 5px;
    color: black;
    cursor: pointer;
  }
`;
