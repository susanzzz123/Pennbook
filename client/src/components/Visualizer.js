import { useEffect, useState } from "react"
import Graph from "react-graph-vis"
import Header from "./Header"
import $ from "jquery"
import { useNavigate } from "react-router-dom"

const Visualizer = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      if (data !== "") {
        $.post("http://localhost:3000/getFriends", { username: data }, (friend_data, status) => {
          const nodes_array = []
          const edges_array = []
          nodes_array.push({ id: data, label: data })
          friend_data.forEach((elem) => {
            nodes_array.push({ id: elem.receiver.S, label: elem.receiver.S })
            edges_array.push({ from: elem.sender.S, to: elem.receiver.S })
          })
          setNodes(nodes_array)
          setEdges(edges_array)
        })
      } else {
        navigate("/")
      }
    })
  }, [])

  const options = {
    edges: {
      color: "#000000",
    },
    height: "500px",
  }

  const expand = (username) => {
    $.post("http://localhost:3000/getFriends", { username }, (friend_data, status) => {
      const nodes_array = []
      const edges_array = []
      friend_data.forEach((elem) => {
        nodes_array.push({ id: elem.receiver.S, label: elem.receiver.S })
        edges_array.push({ from: elem.sender.S, to: elem.receiver.S })
      })
      setNodes(nodes.concat(nodes_array))
      setEdges(edges.concat(edges_array))
    })
  }

  const events = {
    selectNode: function (event) {
      expand(event.nodes[0])
    },
  }
  return (
    <>
      <Header></Header>
      <h3 className="text-center">Click on nodes to expand them</h3>
      <Graph
        graph={{ nodes, edges }}
        options={options}
        events={events}
        getNetwork={(network) => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    </>
  )
}

export default Visualizer
