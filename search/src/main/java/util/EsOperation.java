package util;

import model.FileModel;
import model.SearchModel;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by tommenx on 2018/3/18.
 */
public class EsOperation {
    public static final String INDEX = "vdsk";
    public static final String TYPE = "file";
    private Client client;
    public EsOperation() throws Exception {
        this.client = ClientFactory.transportClient();
    }
    public EsOperation(Client client){
        this.client = client;
    }

    /**
     * 通过文件模型创建新文档
     * @param model
     * @throws IOException
     */
    public void createDoc(FileModel model) {
        XContentBuilder builder = null;
        try {
            builder = XContentFactory.jsonBuilder()
                    .startObject()
                        .field("user_id",model.getUserId())
                        .field("type_id",model.getTypeId())
                        .field("download_url",model.getDownloadUrl())
                        .field("title",model.getTitle())
                        .field("content",model.getContent())
                    .endObject();
            IndexResponse indexResponse = this.client
                    .prepareIndex()
                    .setId(String.valueOf(model.getId()))
                    .setIndex(INDEX)
                    .setType(TYPE)
                    .setSource(builder)
                    .get();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    /**
     * 通过文件的Model更新id=id的文档的title
     * @param model
     */
    public void updateDoc(FileModel model){
        try {
            XContentBuilder builder = XContentFactory.jsonBuilder()
                    .startObject()
                        .field("title",model.getTitle())
                    .endObject();
            UpdateResponse updateResponse =this.client
                    .prepareUpdate()
                    .setIndex(INDEX)
                    .setType(TYPE)
                    .setId(String.valueOf(model.getId()))
                    .setDoc(builder)
                    .get();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 根据id删除文档
     * @param model
     */
    public void deleteDoc(FileModel model){
        DeleteResponse deleteResponse = this.client
                .prepareDelete()
                .setIndex(INDEX)
                .setType(TYPE)
                .setId(String.valueOf(model.getId()))
                .get();
    }

    /**
     * 通过关键词查询结果
     * 只取高亮第一部分
     * @param key
     */
    public List<SearchModel> queryByMatch(String key){
        //设置高亮标签
        List<HighlightBuilder.Field> fields = new ArrayList<HighlightBuilder.Field>();
        fields.add(new HighlightBuilder.Field("content"));
        fields.add(new HighlightBuilder.Field("title"));
        HighlightBuilder hBuidler = new HighlightBuilder();
        List<SearchModel> lists = new ArrayList<SearchModel>();
        hBuidler.preTags("<strong style=\"color: #c9302c;font-size:larger\">");
        hBuidler.postTags("</strong>");
        hBuidler.field("content");
        hBuidler.field("title");
//        hBuidler.fields(fields);
        SearchResponse response = client.prepareSearch(INDEX)
                .setTypes(TYPE)
                .setQuery(QueryBuilders.multiMatchQuery(key,"title","content"))
                .highlighter(hBuidler)
                .get();
        SearchHits searchHits = response.getHits();
        System.out.println("总数："+searchHits.getTotalHits());
        SearchHit[] hits = searchHits.getHits();
        for(SearchHit hit:hits){
//            String a = hit.getField("title").getValue();
//            System.out.println(a);
            Map<String,Object> map = hit.getSourceAsMap();
//
//            System.out.println(map.get("title").toString());
//            System.out.println(map);
//            System.out.println(hit.getSourceAsString());
//            System.out.println(hit.getHighlightFields());
            Text[] text;
            int f = 1;
            if(hit.getHighlightFields().get("content")!=null)
                text = hit.getHighlightFields().get("content").getFragments();
            else{
                text = hit.getHighlightFields().get("title").getFragments();;
                f = 0;
            }

            String typeId = map.get("type_id").toString();
            String userId = map.get("user_id").toString();
            String downloadUrl = map.get("download_url").toString();
            String title = map.get("title").toString();
            String hitContent;
            if(f == 0) {
                int min = 50;
                if(map.get("content").toString().length()<50)
                    min = map.get("content").toString().length();

                hitContent = map.get("content").toString().substring(0,min);
                title = text[0].string();
            }
            else
                hitContent = text[0].string();

            SearchModel searchModel = new SearchModel(typeId,userId,title,hitContent,downloadUrl);
//            for (Text str : text) {
//                System.out.println(str.string());
//                System.out.println();
//            }
            lists.add(searchModel);
        }


        return  lists;
    }

    public static void main(String args[]) throws Exception {
        Client client = ClientFactory.transportClient();
        EsOperation operation = new EsOperation(client);
        FileModel model = new FileModel();
//        String files = "80,81";
//        String[] file = files.split(",");

//        for(int i=0;i<file.length;i++){
//            FileModel model = new FileModel();
//            model.setId(Integer.parseInt(file[i]));
//            operation.deleteDoc(model);
//        }
//        model.setTitle("测试改名.ppt");
//        model.setId(9);
//        operation.updateDoc(model);
        List<SearchModel> list = operation.queryByMatch("教师");
        System.out.println(list.get(0).getHit());
//        JSONObject obj = new JSONObject();
//        obj.put("key",list.size());
//        System.out.println(obj.toString());
    }




}
