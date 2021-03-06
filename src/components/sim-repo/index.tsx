import LeftMenu from "./menu/LeftMenu";
import SimSearchAdd from "./sim-search-add";
import SimsList from "./sims-list"
import { useState, useEffect } from "react";
import AddSimModal from "./sims-list/AddSimModal";
import { debounce } from "../../utils/common"; 

const defaultSims: Array<any> = [];

interface Props {
  addSim: ({
    _id,
    owner,
    title,
    description,
    tags,
    imageURL,
  }: any) => Promise<any>;
  editSim: ({ id, updatedSim }: any) => Promise<any>;
  deleteSim: (id: any) => Promise<any>;
  getSims: (searchKeyword: string) => Promise<any>;
}

const Simulations = (props: Props) => {
  const { addSim, editSim, deleteSim, getSims } = props;
  const [sims, updateSims] = useState(defaultSims);
  const [loading, setLoading] = useState(true);
  const [showAddSim, setShowAddSim] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    getSims("")
      .then((data) => {
        console.log(data.sims);
        updateSims(data.sims);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAddClick = () => {
    setShowAddSim(true);
  };

  const handleAddSimClose = () => {
    setShowAddSim(false);
  };

  const onSimAdd = (newSim: any) => {
    updateSims([...sims, newSim]);
    addSim(newSim)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  const onSimUpdate = (updatedSim: any) => {
    console.log(updatedSim);
    updateSims(
      sims.map((sim) => {
        if (sim._id === updatedSim._id) {
          return updatedSim;
        } else {
          return sim;
        }
      })
    );
    editSim(updatedSim);
  };

  const onSimDelete = (deletedSim: any) => {
    updateSims(sims.filter((sim) => sim._id !== deletedSim._id));
    deleteSim(deletedSim._id);
  };

  const search = (searchKeyword: string) => {
    setLoading(true);
    getSims(searchKeyword)
      .then((data) => {
        updateSims(data.sims);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong!");
        setLoading(false);
      });
  };

  const handleSearchType  = (searchKeyword:string)=>{
    if(searchKeyword === "") {
      searchKeyword = selectedCategory;
    }
    search(searchKeyword);
  }

  const handleSearchDebounced = debounce(handleSearchType, 650);

  const handleCategoryClick = (category:string) => {
    if(category === "All") {
      search("");
      return;
    }
    setSelectedCategory(category);
    search(category);
  }

  return (
    <>
      <style>{style}</style>
      <AddSimModal
        onSimAdd={onSimAdd}
        handleAddSimClose={handleAddSimClose}
        visible={showAddSim}
      />
      <div className={"page-container"}>
        <div className="left-menu">
          <LeftMenu setLoading={setLoading} onCategoryClick={handleCategoryClick} />
        </div>
        <div className="sims-list">
          <SimSearchAdd
            handleAddClick={handleAddClick}
            handleSearch={handleSearchDebounced}
          />
          <SimsList
            onSimUpdate={onSimUpdate}
            onSimDelete={onSimDelete}
            sims={sims}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  );
};

const style = `
    .left-menu {
        height:100vh;
        width: 15%;
    }   
    .sims-list {
        height: 100vh;
        overflow-y: scroll;
        width: 85%;
    }
    .page-container {
        width:100vw;
        display:flex;
        flex-direction:row;
        height:100vh;
    }
    .loading {
      opacity: 0.3;
      background-color: black;
      pointer-events:none;
    }
`;

export default Simulations;
