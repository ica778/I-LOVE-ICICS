import styles from './Explore.module.scss';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box,
  Typography,
} from '@material-ui/core';
import { useQuery } from 'react-query';
import { getSentencesQuery } from '../queries/sentence';
import { useState } from 'react';
import Sentence from './Sentence';

const modalStyle = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '50%',
  width: '90%',
  bgcolor: '#282828',
  color: 'lavender',
  border: '4px solid lavender',
  boxShadow: 24,
  p: 4,
  overflow: 'scroll',
};

function Explore() {
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [sort, setSort] = useState(30);
  const { data } = useQuery('sentences', getSentencesQuery, {
    onError: err => {
      console.error(err);
    },
    onSuccess: console.log,
  });
  console.log({ data });
  return (
    <div>
      <h1>Explore</h1>

      <div className={styles.dropBox}>
        <FormControl className={styles.dropDown}>
          <InputLabel>Sort By</InputLabel>
          <Select
            label="Sort By"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <MenuItem value={24}>Last 24 Hours</MenuItem>
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={30}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Modal
        open={selectedSentence ? true : false}
        onClose={() => setSelectedSentence(null)}
      >
        <Box sx={modalStyle}>
          <Sentence
            sentenceBoxId={selectedSentence?._id}
            sentence={selectedSentence?.text}
            noComments={selectedSentence?.comments?.length}
          />
        </Box>
      </Modal>

      <div className={styles.grid}>
        {data?.map(sentence => (
          <div
            key={sentence._id}
            className={styles.card}
            onClick={() => setSelectedSentence(sentence)}
          >
            {sentence.text}
            {/* {sentence.source} */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explore;
