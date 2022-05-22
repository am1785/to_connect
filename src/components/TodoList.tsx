import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update, remove} from "firebase/database";
// import { FormCheck } from "react-bootstrap";

import firebaseApp from "../firebase";
import { Oath } from "../types";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const TodoList = () => {
  const db = getDatabase(firebaseApp);
  const [todoList, setTodoList] = useState<Oath[]>([]);

  useEffect(() => {
    const todoRef = ref(db, "/toconnect");

    onValue(todoRef, (snapshot) => {
      const todos = snapshot.val();
      const newTodoList: Oath[] = [];

      for (let id in todos) {
        newTodoList.push({ id, ...todos[id] });
      }

      setTodoList(newTodoList);
    });
  }, [db]);

  // const updateOath = (oath: Oath) => {
  // const todoRef = ref(db, "/toconnect/" + oath.id);
  // update(todoRef, { done: !oath.done });
  // };
  const upvoteOath = (oath: Oath) => {
    const oathRef = ref(db, "toconnect/" + oath.id);
    update(oathRef, {score: oath.score + 1 });
  }

  const downvoteOath = (oath: Oath) => {
    const oathRef = ref(db, "toconnect/" + oath.id);
    update(oathRef, {score: oath.score - 1 });
  }

  function DeleteDialog ({id, title, score, creator}: Oath) {
    // dialoague component that warns the user before deleting an oath

    const removeOath = (oathID: String) => {
      // function that deltes an Oath given an oath id
      console.log("id: " + oathID);
      const oathRef = ref(db, 'toconnect/' + oathID);
      console.log("oathReg: " + oathRef);
      remove(oathRef);
    }

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Button variant="outlined" onClick={handleClickOpen}>
          <DeleteIcon />
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure to delete this oath?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Once an oath is deleted, it cannot be restored!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button sx= {{'color': "red"}} onClick={() => {removeOath(id); handleClose();}} autoFocus>
              Yes, delete it
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <h2>Our Oaths</h2>
      {todoList.map((oath, index) => {
        return (<>
          <Stack direction="row" spacing={2}
          justifyContent="center"
          alignItems="center">
            <span>{oath.title}</span>
            <IconButton color="primary" onClick={()=>{upvoteOath(oath)}}>
              <ArrowCircleUpIcon />
            </IconButton>
            <span>{oath.score}</span>
            <IconButton  color="secondary" onClick={()=>{downvoteOath(oath)}}>
              <ArrowCircleDownIcon />
            </IconButton>
            <DeleteDialog id={oath.id} title={oath.title} score={oath.score} creator={oath.creator} />
          </Stack>
        </>)
      })}
    </div>
  );
};

export default TodoList;