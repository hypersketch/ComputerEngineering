import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { username } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(`http://localhost:8081/comments/${username}`);
        setComments(result.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    fetchData();
  }, [username]);

  const handleDeleteComment = async (userID, commentId) => {
    try {
      await axios.delete(`http://localhost:8081/comments/delete`, {
        data: {
          userID: userID,
          username: username
        }
      });
      // Filter out the deleted comment from the comments array
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`http://localhost:8081/comments/create`, {
        userID: 'defaultUserID',
        username: username,
        comment: newComment
      });

      // Add the newly created comment to the comments array
      setComments([...comments, result.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div>
      <h1>Comments</h1>
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group controlId="commentForm">
          <Form.Control
            type="text"
            placeholder="Enter your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ width: "410px", float: 'left' }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Submit</Button>
      </Form>
      {comments.map(comment => (
        <Card key={comment._id} body outline color="success" className="mx-1 my-2" style={{ width: "30rem" }}>
          <Card.Body>
            <Card.Title>{comment.username}</Card.Title>
            <Card.Text>{comment.comment}</Card.Text>
            <Button variant="danger" onClick={() => handleDeleteComment(comment.userID, comment._id)}>Delete</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default CommentsPage;