package model;

/**
 * Created by tommenx on 2018/3/19.
 */
public class SearchModel {
    private String typeId;
    private String userId;
    private String title;
    private String downloadUrl;
    private String hit;

    public SearchModel() {
    }

    public SearchModel(String typeId, String userId, String title, String hit,String downloadUrl) {
        this.typeId = typeId;
        this.userId = userId;
        this.title = title;
        this.hit = hit;
        this.downloadUrl = downloadUrl;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getHit() {
        return hit;
    }

    public void setHit(String hit) {
        this.hit = hit;
    }
}
