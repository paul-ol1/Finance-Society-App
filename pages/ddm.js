import React, { useEffect, useState } from "react";

function ddm() {
  return (
    <div>
      <h1>DDM</h1>
      <input list="complist" id="complist-choice" name="complist-choice" />
      <datalist id="complist">{options}</datalist>
    </div>
  );
}

export default ddm;
