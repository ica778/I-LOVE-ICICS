import styles from './Explore.module.scss';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import { getSentencesQuery } from '../APIProvider';
import { useState } from 'react';
import Sentence from './Sentence';
// import { getSentencesQuery } from '../queries/sentence';
import { useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { bottomOfPage, updateExploreSentences, setExploreSentences } from '../actions';

const modalStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: 'minmax(auto, 50%)',
  width: '90%',
  bgcolor: '#282828',
  color: 'lavender',
  border: '2px solid lavender',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

const populate = 'submittedBy text responses';

function Explore() {
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [timeFilterKey, setTimeFilterKey] = useState('7 days');
  const [orderKey, setOrderKey] = useState('recent');
  const dispatch = useDispatch();

  let atBottomOfPage = useSelector(function (state) {
    return state.searchpageReducer.atBottomOfPage;
  });

  let exploreSentences = useSelector(function (state) {
    return state.searchpageReducer.exploreSentences;
  });

  useEffect(() => {
    if (atBottomOfPage != null && atBottomOfPage) {
      if (exploreSentences.length > 0) {
        fetchSentences(exploreSentences[exploreSentences.length - 1]._id);
      }
      dispatch(bottomOfPage(null));
      setTimeout(function() {
        dispatch(bottomOfPage(false));
      }, 250);
    }
  }, [atBottomOfPage])

  async function fetchSentences(id) {
    console.log(exploreSentences[exploreSentences.length - 1].text)
    console.log(id);
    let res;

    if (!id) {
      res = await axios.get(baseUrl + '/sentence/recent50', {
      params: {
        populate, orderKey, timeFilterKey
      }
    })
    } else {
      res = await axios.get(baseUrl + '/sentence/recent50', {
        params: {
          populate, orderKey, timeFilterKey, sentenceId: id
        }
      })
    }
    
    dispatch(updateExploreSentences(res.data));
  }

  async function updateSentences() {
    console.log(orderKey);
    let res;
    res = await axios.get(baseUrl + '/sentence/recent50', {
      params: {
        populate, orderKey, timeFilterKey
      }
    })
    dispatch(setExploreSentences(res.data));
  }

  useEffect(() => {
	  updateSentences()
  }, [orderKey, timeFilterKey])

  return (
    <div id='parentdiv'>

      <div className={styles.dropBox}>
        <FormControl className={styles.dropDown}>
          <InputLabel>From:</InputLabel>
          <Select
            label="From"
            value={timeFilterKey}
            onChange={e => setTimeFilterKey(e.target.value)}
          >
            <MenuItem value={'24 hours'}>Last 24 Hours</MenuItem>
            <MenuItem value={'7 days'}>Last 7 Days</MenuItem>
            <MenuItem value={'30 days'}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </div>

	  <div className={styles.dropBox}>
        <FormControl className={styles.dropDown}>
          <InputLabel>Order By</InputLabel>
          <Select
            label="Order By"
            value={orderKey}
            onChange={e => setOrderKey(e.target.value)}
          >
            <MenuItem value={'trending'}>Trending</MenuItem>
			<MenuItem value={'recent'}>Recent</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Modal
        open={selectedSentence ? true : false}
        onClose={() => setSelectedSentence(null)}
      >
        <Box sx={modalStyle}>
          {selectedSentence ? (
            <Sentence
			  userid={selectedSentence.submittedBy}
              id={selectedSentence._id}
              text={selectedSentence.text}
              comments={selectedSentence.comments}
            />
          ) : null}
        </Box>
      </Modal>

      <div id="hey" style={{overflow: 'auto'}}>
        {exploreSentences.map(sentence => (
          <div
		    userid={sentence.submittedBy}
            key={sentence._id}
            className={styles.card}
            onClick={() => setSelectedSentence(sentence)}
          >
            {sentence.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
