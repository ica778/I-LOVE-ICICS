import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Card, CardContent, Typography, CardActions } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import {
  updateCurrentComments,
  updateUserSavedSentences,
  updateUserId,
  eraseCurrentComment,
  updateOtherSavedSentences,
  updateOtherSubmittedSentences,
  updateUserProfileMode
} from '../actions/index';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { getCommentsQuery } from '../queries/sentence';
import styles from './Sentence.module.scss';
import { baseUrl } from '../config';
import axios from 'axios';
import Highlightable from 'react-highlight';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";


const Sentence = props => {
  let { userid, id, text, comments, highlightedPart, usefulnessRating } = props;
  const [commentSectionOpen, setCommentSectionOpen] = useState(false);
  const [currentCommentText, setCurrentCommentText] = useState('');
  const [currentCommentsSentence, setCurrentCommentsSentence] = useState(comments);
  const [redirectBool, setRedirectBool] = useState(false);
  const [usefulnessRatingVar, setUsefulnessRatingVar] = useState(usefulnessRating);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  let currentComments = useSelector(function (state) {
    return state.commentReducer.currentComments;
  });

  let userSavedSentences = useSelector(function (state) {
    return state.userReducer.userSavedSentences;
  });

  useEffect(() => {
	if (redirectBool === true) {
		navigate('/user_profile', {replace: true });
	}
  }, [redirectBool])

  useEffect(() => {
    console.log({ props });
    console.log(currentComments);
    if (currentComments && id in currentComments) {
      setCommentSectionOpen(true);
      setCurrentCommentText(currentComments[id]);
    }
  }, []);

  const handleCommentOpenButton = async () => {
    console.log('Hi');
	let res = await axios.get(baseUrl + `/sentence/${id}/comments`);
	console.log(res.data);
	setCurrentCommentsSentence(res.data);
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

  const handleSubmitComment = async () => {
	console.log('sub mitting comment')
	try {
		const res = await axios.post(baseUrl + '/comment', {
			text: currentCommentText,
			submittedBy: localStorage.getItem('userId'),
			sentenceId: id
		});
		const comment = res.data;
		setCurrentCommentsSentence([...currentCommentsSentence, comment.data ]);
		setCurrentCommentText('');
		console.log(comment);
	} catch (err) {
		console.log(err);
	}
  }

  const handleUpvoteSentence = async() => {
	try {
		const res = await axios.put(baseUrl + '/sentence/upvote', {
			id
		});
    setUsefulnessRatingVar(usefulnessRatingVar + 1);
	} catch (err) {
		console.log(err);
	}
  }

  const handleSaveSentence = async() => {
	try {
		const globalUserId = localStorage.getItem("userId");
		const res = await axios.put(baseUrl + `/user/${globalUserId}/save/${id}`);
		const savedSentence = res.data;
		dispatch(updateUserSavedSentences([...userSavedSentences, {_id: savedSentence._id, text: savedSentence.text, comments: savedSentence.comments}]));
	} catch (err) {
		console.log(err);
	}
  }

  const handleRedirectToProfile = async() => {
    console.log(userid);
    const res = await axios.get(baseUrl + `/user/${userid}/sentences`);
    dispatch(updateOtherSavedSentences(res.data.savedSentences));
    dispatch(updateOtherSubmittedSentences(res.data.submittedSentences));
    dispatch(updateUserProfileMode('other'));
    setRedirectBool(true);
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
			<IconButton style={{
				position: 'absolute',
				top: '35px'
			}} onClick={handleRedirectToProfile}> <PersonIcon/> </IconButton>
            <CardContent
              style={{
				left: '20px',
				position: 'relative',
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {text}
            </CardContent>
			{usefulnessRatingVar > 0 && <Typography style={{position: 'absolute', left: '80%', bottom: '27%'}}>+{usefulnessRatingVar}</Typography>}
			<IconButton style={{
				position: 'absolute',
				left: '81.5%'
			}} onClick={handleUpvoteSentence}>
				<ThumbUpIcon/>
			</IconButton>

			<IconButton style={{
				position: 'absolute',
				left: '84%'
			}} onClick={handleSaveSentence}>
				<AddIcon/>
			</IconButton>

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
              +{currentCommentsSentence.length} Comment{' '}
            </Button>
          </div>
        </Card>
        {commentSectionOpen && (
          <Card style={{ marginTop: '10px', marginBottom: '20px' }}>
            <CardContent className={styles.grid}>
              {currentCommentsSentence.map(comment => {
				console.log(comment);
                return <Card key={comment._id} className={styles.card}>
                  {comment.submittedBy} : {comment.text}
                </Card>
				})}
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
