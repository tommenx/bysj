package model;

/**
 * Created by tommenx on 2018/3/18.
 */
public class FileModel {
    private int id;
    private int typeId;
    private int userId;
    private String downloadUrl;
    private String title;
    private String content;

    public FileModel() {
    }

    public FileModel(int id, int typeId, int userId, String downloadUrl, String title, String content) {
        this.id = id;
        this.typeId = typeId;
        this.userId = userId;
        this.downloadUrl = downloadUrl;
        this.title = title;
        this.content = content;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTypeId() {
        return typeId;
    }

    public void setTypeId(int typeId) {
        this.typeId = typeId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
