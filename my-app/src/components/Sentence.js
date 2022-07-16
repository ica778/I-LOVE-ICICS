import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import {
  updateCurrentComments,
  updateUserId,
  eraseCurrentComment,
} from '../actions/index';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { getCommentsQuery } from '../queries/sentence';
import styles from './Sentence.module.scss';
import { baseUrl } from '../config';
import axios from 'axios';

const Sentence = props => {
  const { id, text, comments } = props;
  const [commentSectionOpen, setCommentSectionOpen] = useState(false);
  const [currentCommentText, setCurrentCommentText] = useState('');
  const dispatch = useDispatch();

  let currentComments = useSelector(function (state) {
    return state.commentReducer.currentComments;
  });

  useEffect(() => {
    console.log({ props });
    console.log(currentComments);
    if (currentComments && id in currentComments) {
      setCommentSectionOpen(true);
      setCurrentCommentText(currentComments[id]);
    }
  }, []);

  const handleCommentOpenButton = () => {
    console.log('Hi');
    setCommentSectionOpen(true);
  };

  const handleCommentText = e => {
    setCurrentCommentText(e.target.value);
    dispatch(
      updateCurrentComments({ id, commentText: e.target.value })
    );
  };

  const handleCloseCommentSection = () => {
    setCommentSectionOpen(false);
    setCurrentCommentText('');
    console.log(id);
    dispatch(eraseCurrentComment(id));
  };

  const handleSubmitComment = () => {
	// const res = await axios.post(baseUrl + '/comment', {
	// 	text: currentCommentText,
	// })
  }

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <Card
          style={
            commentSectionOpen
              ? { padding: '7px' }
              : { padding: '7px', marginBottom: '20px' }
          }
        >
          <div>
            <CardContent
              style={{
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {text}
            </CardContent>

            <Button
              onClick={handleCommentOpenButton}
              style={{
                position: 'relative',
                top: '4px',
                left: '90%',
                height: '2em',
                color: 'lavender',
                background: '#181818',
              }}
            >
              {' '}
              +{comments.length} Comment{' '}
            </Button>
          </div>
        </Card>
        {commentSectionOpen && (
          <Card style={{ marginTop: '10px', marginBottom: '20px' }}>
            <CardContent className={styles.grid}>
              {comments.map(comment => (
                <Card key={comment._id} className={styles.card}>
                  {comment.submittedBy} : {comment.text}
                </Card>
              ))}
            </CardContent>
            <CardContent>
              <TextField
                id="standard-multiline-flexible"
                label="Comment"
                multiline
                maxRows={3}
                fullWidth
                value={currentCommentText}
                onChange={handleCommentText}
                variant="outlined"
                minRows={3}
              />
            </CardContent>
            <CardActions>
              <Button onClick={handleSubmitComment}>Submit</Button>
              <Button onClick={handleCloseCommentSection}>Cancel</Button>
            </CardActions>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Sentence;
