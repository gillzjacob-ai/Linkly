from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_chat_creates_job():
    response = client.post('/chat', json={'prompt': 'hello'})
    assert response.status_code == 200
    body = response.json()
    assert 'job_id' in body
    assert body['status'] == 'assigned'
