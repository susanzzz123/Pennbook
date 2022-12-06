import React from "react";

export const Post = ({ img, user, content, type, date }) => {
	const currDate = new Date(date).toString();
	return (
		<div className="card" style={{ width: "18rem" }}>
			<img className="card-img-top" src={img} alt="Card image cap" />
			<div className="card-body">
				<h5 className="card-title">{user}</h5>
				<h6>{currDate}</h6>
				<p className="card-text">{content}</p>
				{type === "post" && <button class="btn btn-primary">Comment</button>}
			</div>
		</div>
	);
};
